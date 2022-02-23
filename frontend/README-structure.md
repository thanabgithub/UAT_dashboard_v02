# Structure

- Everything outside pages should be reusable.
- utilis are reusable codes serving non-external communication/interacing process.
- Adapters (Service) contains API things

        src/
        |-- components/
        |   |-- Avatar/
        |   |   |-- Avatar.jsx
        |   |   |-- Avatar.test.js
        |   |-- Button/
        |   |   |-- Button.jsx
        |   |   |-- Button.test.js
        |   |-- TextField/
        |       |-- TextField.jsx
        |       |-- TextField.test.js
        |-- contexts/
        |   |-- UserContext/
        |       |-- UserContext.js
        |-- hooks/
        |   |-- useMediaQuery/
        |       |-- useMediaQuery.js
        |-- pages/
        |   |-- UserProfile/
        |   |   |-- components/
        |   |   |   |-- SomeUserProfileComponent/
        |   |   |       |---index.tsx
        |   |   |       |---bl.tsx
        |   |   |       |-- index.test.js
        |   |   |
        |   |   |-- UserProfile.jsx
        |   |   |-- UserProfile.test.js
        |   |-- index.js
        |-- routes/
        |   |-- routes.jsx
        |   |-- routes.test.js
        |-- utils/
        |   |-- some-util/
        |       |-- index.js
        |       |-- someUtil.js
        |       |-- index.test.js
        |-- adapters/
        |   |-- some-adapter/
        |       |-- index.js/
        |       |-- someService.js/
        |       |-- index.test.js
        |-- App.jsx
        |-- index.js

https://reboot.studio/blog/folder-structures-to-organize-react-project/

https://www.freecodecamp.org/news/a-better-way-to-structure-react-projects/

https://engineering.udacity.com/react-folder-structure-for-enterprise-level-applications-f8384eff162b
