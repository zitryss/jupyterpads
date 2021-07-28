# JupyterPads

JupyterPads is an extension for the Jupyter Notebook which helps to integrate machine learning pipeline into interactive computing.

Because the data science process is research-oriented, it is usual to have multiple experiments running simultaneously, with many of them never making it to production. This requires a method that keeps track of all the different experiments and hyperparameters that have been attempted. Your data science process will need to support tracking, comparing results from different runs, visualizing, as well as support for moving models that prove to be valid to the next stage of the life cycle. Experiment management in the machine learning field can be a very time-consuming activity for developers. The project’s goal was to create an extension for an interactive notebook that will take care of all the overhead associated with the experiment management and potentially improve human-computer interaction.

![1](https://user-images.githubusercontent.com/2380748/127292347-e74434e3-89d2-4ff1-89ad-e3d476545406.png)
![2](https://user-images.githubusercontent.com/2380748/127292402-4abdf680-26fd-4b72-a1c4-d648b25a8025.png)


This extension is composed of a Python package named `jupyterpads`
for the server extension and a NPM package named `jupyterpads`
for the frontend extension.


## Requirements

* JupyterLab >= 2.0

## Install

Note: You will need NodeJS to install the extension.

```bash
pip install jupyterpads
jupyter lab build
```

## Troubleshoot

If you are seeing the frontend extension but it is not working, check
that the server extension is enabled:

```bash
jupyter serverextension list
```

If the server extension is installed and enabled but you are not seeing
the frontend, check the frontend is installed:

```bash
jupyter labextension list
```

If it is installed, try:

```bash
jupyter lab clean
jupyter lab build
```

## Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Move to jupyterpads directory

# Install server extension
pip install -e .
# Register server extension
jupyter serverextension enable --py jupyterpads --sys-prefix

# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension install .
# Rebuild Typescript source after making changes
jlpm build
# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
```

Now every change will be built locally and bundled into JupyterLab. Be sure to refresh your browser page after saving file changes to reload the extension (note: you'll need to wait for webpack to finish, which can take 10s+ at times).

### Uninstall

```bash
pip uninstall jupyterpads
jupyter labextension uninstall jupyterpads
```
