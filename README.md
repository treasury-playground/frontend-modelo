# Exemplo

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.3.

## Once you clone the repository, type in the terminal:

```bash
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Components

Run the following command in the terminal inside your Angular project:

```bash
ng add @angular/material
```

## To use the PrimeNG and Ngx Bootstrap libraries for components:

```bash
npm install primeng primeicons
npm install bootstrap ngx-bootstrap
```

This installs:

PrimeNG: UI Components for Angular.
PrimeIcons: PrimeNG Icons.
Bootstrap: CSS Framework.
Ngx Bootstrap: Bootstrap Components for Angular.

## Install JSON Server

If you don't already have JSON Server installed, open the terminal and install it globally via npm (the Node.js package manager):

```bash
npm install -g json-server
```

## Run JSON Server

Now, in the terminal, navigate to the folder where db.json is located and run the command:

```bash
json-server --watch db.json
```