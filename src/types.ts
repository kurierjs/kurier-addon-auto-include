import "kurier";

export interface AutoIncludeAddonOptions {
  mode?: "aside" | "extend";
}

declare module "kurier" {
  interface ResourceSchemaRelationship {
    autoInclude?: boolean;
  }
}
