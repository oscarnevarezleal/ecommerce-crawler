## Notes

Note: You need to create your own service-key.json file
Note: if this is your first time using GCP, you need to authenticate your laptop to use GCP services by running gcloud auth login from the command line. If you don’t have gcloud installed, go back to the top of the post and install the listed dependencies.

## It´s time to build and push our image:

docker build -t gcr.io/$(gcloud config get-value project)/worker .
gcloud docker -- push gcr.io/$(gcloud config get-value project)/worker

After you have finished the crawl process you could export the data by typing into your console the following lines

gcloud datastore export --namespaces="(default)" gs://${BUCKET}
