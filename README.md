# 📓 NoteHub automation

This repository contains NoteHub's GitHub actions.

# 💻 Usage

The action contained in this repository can be used to automate your Notebook. The action accepts commands that will do some activity on your Notebook, for example, generate a new journal entry.

To use the action, you must create a `.github/workflows` directory and setup a [GitHub actions workflow](https://docs.github.com/en/free-pro-team@latest/actions/quickstart#creating-your-first-workflow) inside your Notebook repository.

## Journal entry creator

To use this template you will need to add the following secrets to your Notebook repository:

* GH_TOKEN - A personal access token. See [here](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) on how to create one
* REPO - the repository name given to your Notebook, defaults to `NoteHub.Notebook`
* ROOT_DIR - the directory containing your journal entries and journal template, defaults to `Journal`

Copy and past this template into a workflow `yml` file inside `.github/workflows`. 

```yaml
name: 'create-journal-entry'
on:
  schedule:
    - cron: '1 */24 * * *' # Run action at 1 minute past midnight
  # workflow_dispatch: # Uncomment this if you would like to run the workflow manually. Useful for testing

jobs:
  create-journal-entry:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses:  Sound1ab/NoteHub.Actions@v1.0.2
        with:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          REPO: ${{ secrets.REPO }}
          ROOT_DIR: ${{ secrets.ROOT_DIR }}
          COMMAND: 'create-journal-entry'
```
