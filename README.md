# @kurier/addon-auto-include

A Kurier addon that alters GET operations to automatically include relationships.

## Usage

Install it using npm or yarn:

```bash
$ npm i -D @kurier/addon-auto-include
$ yarn add -D @kurier/addon-auto-include
```

Add it to your Kurier app:

```ts
import AutoIncludeAddon from "@kurier/addon-auto-include";
// ...
app.use(AutoIncludeAddon);
```

Apply the addon to any resource relationship by setting the `autoInclude` flag to `true`:

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
        autoInclude: true,
        foreignKeyName: "design_id",
      },
    },
  };
}
```

## License

MIT
