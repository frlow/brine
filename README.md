# Brine

### What is Brine?

Brine is a build tool for component libraries. It takes components written in your favourite framework and converts them
to web components. It also generates typed wrappers so that any component can easily be used in any framework.

Brine supports components written in the following frameworks:

- React
- Vue (3)
- Svelte
- Solid

Brine also generates typed wrappers for the following frameworks:

- React
- Vue (3)

### Installing

```
yarn add @frlow/brine
```

### Getting started

```
# Initialize a Brine project using
brine init my-library
cd my-library
yarn
yarn start
```

### Build your library for release

```
yarn build
```