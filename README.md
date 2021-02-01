==========================
# Mapyo
==========================

- [x] Implemented Sidebar
- [x] Implemented Geolocation and Map 
- [x] Implemented Weather data, Wikipedia data, News Articles
- [ ] Add preloader to make the map render better
- [ ] Add Coronavirus data, Exchange Rate, Earthquake data, Oceans data 
- [ ] Add markers for various map locations
- [ ] Submit live version

![GitHub Logo](/extra/desc.jpg)

==========================
## Technologies Used
==========================

* PHP
* Javascript
* HTML
* CSS
==========================
## Simple Description
==========================

This is Mapyo, a one-page map that returns the various locations the user chooses from a sidebar on the left of the page. When the user first loads the page the map will center to his current location(provided he agrees to share his location with the site), this will then highlight the country borders and show the user a side panel on the left containing various pieces of information such as Wikipedia description, weather information, news information, coronavirus statistics, exchange rates, earthquake data,  oceans or seas nearby and more. For a detailed overview of how this is done please read the Technical Description below.

==========================
## Technical Description
==========================

So how does the app work? Well, first it loads the necessary files in an HTML file and renders the HTML, at the same time our script runs namely(script.js) this script renders a map together with a CSS stylesheet. After this, the script starts requesting the user coordinates which it will then send to an API called geonames, this will return us the country name associated with the coordinates provided, with this we can then highlight the user location by making some DOM manipulations. The script also makes requests to three more API`s namely: wikipedia.org, openwheathermap.org, and newsapi.org, however, these requests are done by invoking a PHP routine server-side using Cors and returning a result to be processed by the script on return. The select on the left top of the sidebar needs to be populated with a list of countries, for this we will once again use a PHP routine but this time this will work by calling a JSON file within the application filesystem.

==========================
### Some Problems I Encountered So Far
==========================

1. The way we get user location coordinates is using another API that is built within Javascript called (navigator. geolocation) the way this API work as of some time ago is that it requires a secure HTTPS connection to allow a users location to be used by the website. I have been coding on localhost so when I changed to an HTTPS connection various issues propped up some of which being compatibility with the current version of the software I had.

2. For the sidebar I wanted to make the user`s experience as pleasant as possible and so I wanted to create a sidebar that would open on a click to the map borders and also close on sequential click so I had to research the best way to do this.

3. With country names such as the United Kingdom and the United States namely countries with space in between the program were not returning anything when it came from the back end, but when I tested the request in the browser it worked so I had found a neat workaround that was implementing a %20 instead of spaces, I presume this issue arose because of Wikipedia`s API as my other API calls return data just fine without it.
