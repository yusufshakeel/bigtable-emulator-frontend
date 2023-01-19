import {Bigtable} from "@google-cloud/bigtable";

export default function bigtableInstance() {
    const {env: {GOOGLE_CLOUD_PROJECT, GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_BIGTABLE_INSTANCE}} = process
    const bigtableOptions = {projectId: GOOGLE_CLOUD_PROJECT, keyFilename: GOOGLE_APPLICATION_CREDENTIALS};
    const bigtableClient = new Bigtable(bigtableOptions);
    return bigtableClient.instance(GOOGLE_BIGTABLE_INSTANCE);
}