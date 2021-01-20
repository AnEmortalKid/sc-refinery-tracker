# sc-refinery-tracker

The Refinery Tracker keeps track of your refinery jobs in StarCitizen

See in action:

LIVE: http://anemortalkid.github.io/starcitizen/mining_tracker/
DEV: https://anemortalkid.github.io/sc-refinery-tracker/

## Data

* All data is kept locally on your browser through the usage of `localStorage` (for now)

## Usage

A set of refinery jobs is tracked by user (in the event that you have multiple users working on the same machine).

1. Start by creating a user (it can be any name, but I recommend using your username's handle)

![](./docs/start_create_user.png)
![](./docs/create_user_dialog.png)

2. Add a Refinery Job for your user by clicking the "Add Job" button

![](./docs/add_job_view.png)

3. Fill out your job's details

![](./docs/add_job_dialog.png)

4. Once your jobs are complete (or estimated to be complete, their status will be marked "Done")

![](./docs/job_status_table.png)

By default, jobs update their Time Remaining every second. If you would like to change this value, change the Settings for the user.

### Settings

1. Use the COG icon after selecting a User
2. Modify the settings in the dialog

![](./docs/user_settings_dialog.png)
