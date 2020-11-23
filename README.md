# @kurier-addons/many-to-many

A Kurier addon that creates intermediate resource types for many-to-many relationships.

## Usage

Install it using npm or yarn:

```bash
$ npm i -D @kurier/addon-many-to-many
$ yarn add -D @kurier/addon-many-to-many
```

Add it to your Kurier app:

```ts
import ManyToManyAddon from "@kurier/addon-many-to-many";
// ...
app.use(ManyToManyAddon);
```

Apply the addon to any resource relationship by setting the `manyToMany` flag to `true`:

```ts
import { Resource } from "kurier";
import Designer from "./designer";

export default class Collection extends Resource {
  static schema = {
    attributes: {
      name: String,
      slug: String,
    },
    relationships: {
      designers: {
        type: () => Designer,
        manyToMany: true,
        foreignKeyName: "design_id",
      },
    },
  };
}
```

## License

MIT
