FormsPage Component
The FormsPage component is the heart of the Fast Data Entry (FDE) feature in OpenMRS 3.x . Below is the difference between the newer and updated version of the formspage :

What Does It Do?
1. Fetches Forms:
     It pulls all the forms from the backend and gets them ready for display.
2. Organizes Forms:
     Forms are grouped into categories (like "All Forms," "Vitals," etc.) so users can easily find what they need.
3. Tabs for Navigation:
     It uses a tabbed interface (thanks to Carbon Design System) to switch between "All Forms" and specific categories.
4. Saves Your Work:
     It remembers which forms you’re working on, so you don’t lose progress if you refresh the page or navigate away.

What’s New in the Improved Version?
1. TypeScript:
      I added TypeScript types to make the code easier to understand and debug.
2. Faster Performance:
      By using useMemo,I made sure the app runs smoothly, even with lots of forms.
3. Better Error Handling:
      The app now checks for missing or invalid data, so it won’t crash if something goes wrong.
4. Scalable State Management:
   Instead of relying on localStorage, I laid the groundwork for a more robust way to manage state (like using React Context or RFE hooks).
