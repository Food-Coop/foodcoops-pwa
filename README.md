# Food-Coop-PWA

Food-coop warehouse management software fronted with react.<br>
This project was bootstrapped with 
[Create React App](https://github.com/facebook/create-react-app).

___

##Domain knowledge

A food-coop warehouse contains defined amounts (**Menge**) of goods (**Produkt**),
largely foodstuff. Each *Produkt* is of a specific **Kategorie** (literally
category), e.g. meat or vegetable. The current stock (**istLagerbestand**) of
each *Produkt* and the current target stock (**sollLagerbestand**) can be set by
the buyer (**Einkäufer**). The *Einkäufer* can also define new amounts (**Menge**,
e.g. kg, liters), new kinds of *Produkt* and new kinds of  *Kategorie* of goods.
---

### Ubiquitous language glossary

**Produkt**<br>
Product: Individual products of wares in the warehouse.

**Menge**<br>
Amount: The specific count, weight or volume (depending on the product in
question), that the *Produkt* is measured in.

**Kategorie**<br>
Specific category of *Produkt*. For example, the warehouse might be sorted into
meat, vegetables, noodles, grains, etc.

**Lagerbestand**<br>
The **istLagerbestand** amount of a *Produkt* in the warehouse.<br>
The **sollLagerbestand** amount of a *Produkt* in the warehouse.
---

### Roles

**Rollen**<br>
Roles of food-coop members. Includes *Mitglied* and *Einkäufer*. Roles currently outside 
project-scope include *Ladendienst*.

**Mitglied**<br>
Food-coop members. Members or *Mitglieder* get products through the food-coop store. Stock
is bought collectively from farmers and wholesalers.

**Einkäufer**<br>
Buyer: Food-coop member that keeps the warehouse stocked by buying from 
farmers and wholesaler.

---

### Use cases

**Ansicht Lagerbestand**<br>
A complete view of the all stock for the convenience of the buyer (*Einkäufer*).
This REST-API provides the current stock (*istLagerbestand*) and target stock
(*sollLagerbestand*) of each product (*Produkt*) sorted by categories
(*Kategorie*) and product via JSON. This PWA populates the table with this information. 
Categories can be collapsed to provide simplified browsing. 

**Externe Bestellungsliste**<br>
Buyer (*Einkäufer*) gets a list of all products(*Produkte*) with current stock
levels (*istLagerbestand*) below target stock levels (*sollLagerbestand*),
and the amount (*Menge*) that is missing. The backend provides the information via 
JSON. This PWA turns it into a pdf.

**Neues Mitglied**<br>
Nordstadt food-coop is built on trust. Any member (*Mitglied*) can invite a new member. 
All it takes is for the current member to log into the site with his user account and sent 
an invitation email.
 ---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
