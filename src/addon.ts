import { Addon, HasId, KnexProcessor, Operation, Resource, capitalize } from "kurier";

export class AutoIncludeAddon extends Addon {
  shouldAutoInclude(resourceClass: typeof Resource): boolean {
    const relationships = Object.entries(resourceClass.schema.relationships);
    return relationships.some(([, relationship]) => relationship.autoInclude);
  }

  getRelationshipsToAutoInclude(resourceClass: typeof Resource): string[] {
    const relationships = Object.entries(resourceClass.schema.relationships);
    return relationships.filter(([, relationship]) => relationship.autoInclude).map(([key]) => key);
  }

  async install(): Promise<void> {
    this.app.types.filter(this.shouldAutoInclude).map((resource) => {
      const includedRelationships = this.getRelationshipsToAutoInclude(resource);

      const processor = class AutoIncludeProcessor<T extends Resource> extends KnexProcessor<T> {
        static resourceClass = resource;

        async get(op: Operation): Promise<HasId[] | HasId> {
          op.params = { ...(op.params || {}), include: includedRelationships };
          return super.get(op);
        }
      };
      Object.defineProperty(processor, "name", { value: `${capitalize(resource.name)}Processor` });
      this.app.processors.push(processor);
    });
  }
}
