import {
  Addon,
  HasId,
  KnexProcessor,
  Operation,
  Resource,
  capitalize,
  AddonOptions,
  ApplicationInstance,
} from "kurier";
import { AutoIncludeAddonOptions } from "./types";

export class AutoIncludeAddon extends Addon {
  readonly options?: AutoIncludeAddonOptions;

  shouldAutoInclude(resourceClass: typeof Resource): boolean {
    const relationships = Object.entries(resourceClass.schema.relationships);
    return relationships.some(([, relationship]) => relationship.autoInclude);
  }

  getRelationshipsToAutoInclude(resourceClass: typeof Resource): string[] {
    const relationships = Object.entries(resourceClass.schema.relationships);
    return relationships.filter(([, relationship]) => relationship.autoInclude).map(([key]) => key);
  }

  async install(): Promise<void> {
    if (this.options.mode === "aside") {
      await this.asideInstall();
    } else {
      await this.extendInstall();
    }
  }

  private async asideInstall(): Promise<void> {
    for (const resource of this.app.types.filter(this.shouldAutoInclude)) {
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
    }
  }

  private async extendInstall(): Promise<void> {
    for (const resource of this.app.types.filter(this.shouldAutoInclude)) {
      const includedRelationships = this.getRelationshipsToAutoInclude(resource);
      const appInstance = new ApplicationInstance(this.app);
      const processor = await this.app.processorFor(resource.type, appInstance);
      const originalGet = processor.constructor.prototype.get;
      processor.constructor.prototype.get = async function get(op: Operation): Promise<HasId[] | HasId> {
        op.params = { ...(op.params || {}), include: includedRelationships };
        return originalGet(op);
      };
    }
  }
}
