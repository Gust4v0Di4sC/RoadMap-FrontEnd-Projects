
-----

# `itcss-cli`

### CLI to Generate the ITCSS Folder Structure

[](https://www.google.com/search?q=https://www.npmjs.com/package/itcss-cli)
[](https://www.google.com/search?q=LICENSE)

`itcss-cli` is a simple and lightweight command-line tool to kickstart your projects with the **ITCSS (Inverted Triangle CSS)** architecture. With just one command, you can generate the entire folder and file structure, ready to be used with your favorite CSS preprocessor.

-----

### Why ITCSS?

**ITCSS** is a CSS architecture methodology that helps you organize your code in a scalable and maintainable way by controlling specificity and preventing conflicts. It divides your styles into layers, from the most generic to the most specific, creating a predictable and robust codebase.

-----

### Installation

You can install `itcss-cli` globally using npm:

```bash
npm install -g itcss-cli
```

-----

### Usage

Navigate to the root folder of your project and run the command:

```bash
itcss-cli
```

This will create a `styles` folder with the following structure:

```
styles/
├── main.scss
├── settings/
│   ├── _colors.scss
│   └── _fonts.scss
├── tools/
│   └── _mixins.scss
├── generic/
│   └── _reset.scss
├── elements/
│   └── _elements.scss
├── objects/
│   └── _objects.scss
├── components/
│   └── _components.scss
└── trumps/
    └── _utilities.scss
```

The `main.scss` file comes with all dependencies already imported in the correct order, following the ITCSS philosophy.

-----

### Contributing

Contributions are welcome\! If you have suggestions for improvement or find any issues, feel free to open an issue or submit a pull request.

-----

### License

This project is licensed under the MIT License.

-----

### Author

Gustavo dias 
https://github.com/Gust4v0Di4sC
