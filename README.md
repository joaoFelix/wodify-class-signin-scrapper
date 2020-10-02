# Descrition

A simple Pupeteer Web scrapper to sign into my Weightlifting classes.

There are only 8 spots available for these classes and I have been waking up at 5:45 am every Tuesday and Thursday to guarantee one of those spots.
Trying to sign in at 6:30 am? Sorry, no more spots available!
Ain't nobody got time for that!

# Usage

```js
node wodify-signer.js <WODIFY_USERNAME> <WODIFY_PASSWORD> [debug|true|1]
```

The third parameter launches the browser in `headless:false` mode to enable human debugging

If anything goes wrong while executing, it takes a creenshot of the current page state and stores it in the file `$HOME/wodify-signer-error.png`
