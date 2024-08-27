# tk-vDigitInput

A powered 6 Digit OPT Code input field creator. Perfect for verification codes, pins etc


**Example usage**

```

<input type="text" name="validcode" class="pin-code" maxlength="6"  />

<script src="./tk-vDigitInput.js"></script>
<script type="text/javascript">
    new vDigitInput('.pin-code');
</script>

```

**Notes...**
• You MUST set the `maxlength` parameter, otherwise the plugin won't know how many cells to create
• Your forms should work normally - data will be automatically filled into the .pin-code field
• Paste works
• You need to create your own CSS
