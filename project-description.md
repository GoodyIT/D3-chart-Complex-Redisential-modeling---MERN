# ADMIN TOOL

## DEFINITIONS

**RC** - Residential Complex (group of rezidential buildings with similar design)

**Rb** - Residential Building (a block of flats or an individual home)

**ap** - a home (an apartment or house) in an RC

**user** - a person who uses the AdminTool app

**ap construction states**: the states an ap goes through until it's ready to be used. These are tracked on a per-building bases and they flow sequentialy from one to the next. The states are:

DESIGNED -> FOUNDATION -> CONSTRUCTING -> RED -> GRAY -> WHITE -> DONE

**ap sales states**: the states an ap goes through when ready to be sold, cycling through AVAILABLE and RESERVED until it gets SOLD. The states are:

AVAILABLE | RESERVED | SOLD

## GENERAL PRINCIPLES

The AdminTool is used to define an RC completely by defining a JSON file.

All elements should be added or modified later as well (so no restrictions on when an item can be added or updated, but such operations should be handled consistently, always having a correct JSON file).

[Maybe: *We should be able to navigate easily between elements: if a building is defined on a view, we should be able to click that building and go to its associated detailed view.*]

We'll optimize the JSON file for reading, as it's going to be read much more often then written.

Each step is an item on a TODO list that we show on a side of the workspace/screen. We do each step sequentially, but we can adjust things later on. We define tasks in each task group (multiple tasks that have a common purpose and are regarded as a group) as required or optional. **Required** tasks must be completed before moving further. **Optional** tasks can be completed at any time.

We use the ESC or Ctrl+Z keyboard shortcuts to undo the last "thing". Therefore, we need to save actions in a queue and apply a reverse action in case we have to. This will be implemented later.

Any settings we may need to change will go to a settings.json file, that the app will load on start-up.

## SPECS

### 1. Define RC attributes

If the JSON RC.json file does not exist, it will be created. It can be created on the server or it can be handled locally, saving things in the local storage of the browser. But information must be saved at all times, so that no work is wasted.

NOTE: all attributes are optional (they can be defined later as well - no restriction to start with it). But the RC should be initialized here, if not already initialized.

Attributes:

- short description,
- long description (link to an external file, HTML fragment),
- number of buildings (exact, mandatory - we'll use this to define the ToDo list of this RC),
- number of aps (just as a hint, not precise, like 500 aps, and we may alert the user if this is not the same as the actual number of aps defined, but not a requirement),
- number of parking spaces (optional, only as a hint at this stage)

Materials used (can be overriden by each Rb) - just a file at this stage. We might define this as a separate view, with a cross section through walls, and highlighting each material.

Same for internal decorations.

### 2. Define RC views

Load view images.

Define rotation from north for each view, in steps of 10 degrees, +/- (-90, 180, etc).

For each view, define the whole array of building shapes, with buildings that are not visible having a "null"-like state.

We can have any number of views, but at least one, and we're aiming for 5 (Aerial, N, E, S, W).

### 3. Define each building (Rb)

name, # of floors, # of aps, estimated ready date (month of year, eg "2019, May"), ~~footprint (in "m2", square meters)~~

~~Define Rb position on each RC view (already defined Rbs are highlighted, maybe with diferent color shades)~~

### 4. Define floors for each Rb

connect floor plans to each floor of an Rb (we know the number of floors at this stage, so this task is dependent on defining its associated Rb view first). The Tool draws the building as a rectangle having as manny sections as floors. A floor can be selected and associated with a floor plan, or the plan can dragged over the floor. Undo by ESC key.

We keep track of unique "floor-plan-types" by recording the number of links a floor plan image is used.

Each floor of a building must have an associated floor plan to complete this step / task group.

### Defining a shape

you draw a rough rectangle OR polygon (as done now, in the first version):

- click-and-hold starts defining a rectangle, by only two points (ESC removes last point) - a particular type of polygon
- click-release defines a polygon, until ENTER (ESC removes last point)

After the raw polygon is drawn, you can adjust it / fine tune it, by

- defining "mid-points" along any line/segment of the polygon
- dragging any segment parallel with itself (ESC - undoes until defining the mid point)

## Defining aps (apartments)

Apartments are defined on each of the unique floor plans, and we track the unique ap types.

(... more to come)
