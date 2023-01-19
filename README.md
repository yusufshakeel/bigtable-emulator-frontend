# bigtable-emulator-frontend
This project is a frontend for Google Bigtable emulator and runs on localhost.

## Getting started

### Run the emulator

Open terminal and run the following command to start the Google Bigtable emulator.

Following will initialise the environment variable.

```shell
$(gcloud beta emulators bigtable env-init)
```

Now run the following to start the emulator.

```shell
gcloud beta emulators bigtable start
```

At this point we will see the following.

```text
Executing: /usr/local/opt/google-cloud-sdk/platform/bigtable-emulator/cbtemulator --host=localhost --port=8086
[bigtable] Cloud Bigtable emulator running on 127.0.0.1:8086
```

### Run the frontend

Open another terminal and set the following environment variables.

```shell
export GOOGLE_CLOUD_PROJECT=fake-localhost-project

export GOOGLE_APPLICATION_CREDENTIALS=fake-gcloud-account-key.json

export GOOGLE_BIGTABLE_INSTANCE=fake-localhost-instance

export BIGTABLE_EMULATOR_HOST=localhost:8086
```

Now run the following command to start the frontend.

```shell
npm run dev
```