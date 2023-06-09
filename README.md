# Dragon City Crawler - Robots

- **`robots.dbgames()`:** https://dbgames.info/dragoncity/
- **`robots.deetlist()`:** https://deetlist.com/dragoncity/
- **`robots.ditlep()`:** https://ditlep.com/
- **`robots.localization()`** https://sp-translations.socialpointgames.com/deploy/dc/android/prod/dc_android_en_prod_wetd46pWuR8J5CmS.json

## Usage example: getting all data

```js
import robots from "dc-crawler"

(async () => {
    const dbgamesData = await robots.dbgames()
    const deetlistData = await robots.deetlist()
    const ditlepData = await robots.ditelp()
    const localizationData = await robots.localization()
})()
```