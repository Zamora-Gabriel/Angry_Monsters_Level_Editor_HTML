# *** PG20 Gabriel Zamora - Javascript Web Apps  - Level Editor ***
---------------------------------------
<Gabriel Zamora>
<22/03/2021>

The projet is a level editor in which can be created objects and targets as well as saving levels and loading them. 
Levels are created by submitting information for it including objects and targets that were dragged to the editor.
The goal of this assignment is to apply client-server services as well as demonstrate the previous course experience by building a webpage.

[demo] (https://github.com/Zamora-Gabriel/PG20_Gabriel_JavascriptWebApps_A1) | [tutorial] (link)


## Synopsis
---------------
In this project, students were familiarized with the use of JSON and AJAX as well as loading and saving from a client to a server.
Also, JQuery, html5, and css were implemented in order to build a complete level editor page.
Draggables were used as well in order to edit the level in order to populate it with entities to be used in a future game.


# Download/Install
---------------------------------------

Browse to demo link

[Download Zip](https://github.com/Zamora-Gabriel/PG20_Gabriel_JavascriptWebApps_A1/archive/refs/heads/main.zip)

- Once downloaded Uncompress the zip to a folder

- Open the folder in Visual Studio Code

- Once in VSCode, go to the run and debug option and run the server

- Open google chrome or microsoft edge and access to the next URL in parenthesis: 
(http://localhost:3000/editor)

- The demo should be running in the editor client

# *** How to use ***
---------------------------------------

- After the download/install steps, the demo should be shown on the given localhost.

- The page has three main areas from left to right are: The level information, the edit field, and the object library

For the Level information area:

- The default username is the only one that can be accessed to, if it is changed, the page will not save, load, or get the objects or levels in server

- Once launched the page, if the Update User Info button is clicked, the client will sent requests to get all Levels, objects, and targets
as well as the page will start populating the object library with the targets and objects.

- On the dropdown list below Levels tag, an existing level can be selected and after pressing the Load Level button, the edit field and the level information area will be
loaded with the information of that level, placing the cannon/catapult, objects, targets, background and information such as the scores and max shots.

- The background has only two options constrained in the dropdown selector. If the background is changed manually, press the change background button for the new
background to show on the edit field.

- Once edited the values, press the save button in order to save the level, if the level name is equal to a previously loaded one, a message will appear
if the user wants to overwrite the data of that level.

- Levels can be copied by loading a pre-existing level and changing the name. After doing that, just press save button and a the level will be copied.

- After hitting save, hit the update user info button to update all levels and the object library if any other object, target or level were created.

For the edit area:

- Objects and targets can be dragged from the object library to the edit field and placed wherever the user may like.

- Also the cannon/catapult can be dragged and changed of place to match the user's tastes.

- If the user wants to remove an object, just place the mouse over the desired to delete object and click the middle mouse to delete it.

For the object library:

- The user here can drag the objects and targets as mentioned previously but also can create new objects or targets with the existing textures and shapes in server.

- To create a new object or target, the user must press the button that matches the entity to create. 

- A pop up window will emerge and the object or target editor will show.

- The user can load an object if the name is correctly typed, loading all the information that was saved on server.

- A preview f the object may be shown by clicking the preview button.

- Texture and shapes can be changed with the dropdown selectors for those properties.

- Once finished editing or creating, press the save button and it will show a successful message if the save was correctly done. However, if the object or target
already exists, an overwrite message will show and ask if the user wants to overwrite that file. 



# *** Caveats ***
---------------------------------------

- If a problem may occur in a browser, try a different one however the page was proved to run in Google Chrome and Microsoft Edge.
