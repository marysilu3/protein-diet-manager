# Protein Diet Manager (first version)

A mobile-friendly, installable web app prototype for tracking protein intake across multiple profiles.

## Included
- Father profile preloaded: age 66, weight 50.75 kg, post-surgery recovery.
- Add and edit other profiles.
- Configure a daily protein target for each profile.
- Food list with estimated protein values and Malayalam names.
- Food quantity calculator and meal-wise intake log.
- Daily progress and a simple 7-day chart.
- English/Malayalam toggle.
- Offline caching after first successful load.

## Run locally
Open `index.html` in a browser. For install/offline support, serve the folder over HTTPS or localhost.

## Deploy
Upload the extracted folder contents to a static web host (for example, GitHub Pages). No Python server or database is required for this first version.

## Important limitations
- Data is saved in browser localStorage on the device/browser; it does not automatically sync between phones.
- Food protein values are approximate and should be checked against actual food labels/recipes.
- The initial 65 g father target is only a provisional app default (1.2 g/kg). It is not a medical prescription. Confirm the target with his treating doctor/dietitian, especially if kidney function is impaired or diet restrictions apply.
- The meal plan is illustrative, not a post-operative prescription. Follow the surgeon's diet progression and food restrictions.
- Raw and cooked forms must be logged carefully; the food list labels the basis for each item.
