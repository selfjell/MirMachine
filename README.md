# MirMachine Webapp
This is a webapp built for serving an easy-to-use UI 
for the MirMachine lookup/annotation tool 
(see [MirMachine](https://github.com/sinanugur/MirMachine)) 

## Running Django
### Setting up `conda`
Firstly make sure you have the correct conda installed on your computer.

To install the project run `conda env create -n mirmachine -f environment.yml` in the root folder.\
Then run `conda activate mirmachine` to spawn the virtual environment.\
Now you are ready to start Django.\
P.S. if you want to exit the environment type `conda deactivate`

### Running the Django server
In the virtual environment you can run the following:
#### `python manage.py migrate` 
Run this script in the root folder of the project.\
This refreshes Django with potential changes that may be present in the backend.
This should be done after the initial download, and after there are changes made
in the backend.
#### `python manage.py runserver`
Use this script to run the server.\
Make sure you build the frontend before running the server.


## Building the frontend 
Navigate to `lookupService/frontend`
before using the following scripts.\
If you require hot reloading we recommend using a separate 
shell to build the frontend. 

## Installing frontend
Run `npm install` before running for the first time to install the necessary packages and set up the environment.
### `npm run dev`
Runs the app in the development mode.\
Enables hot reloading, making it the best choice when making changes to the frontend.\
Run the Django server and open [http://localhost:8000](http://localhost:8000) to view it in the browser.

The page will update if you make edits. Simply reload to display changes. 

### `npm run build`
Builds the app for production to the `lookupService/static/frontend` folder.\
Webpack bundles the project and optimizes it for production.



