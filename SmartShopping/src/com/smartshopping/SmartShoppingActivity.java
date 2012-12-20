package com.smartshopping;

import org.apache.cordova.DroidGap;

import android.app.Activity;
import android.os.Bundle;

public class SmartShoppingActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        setIntegerProperty("loadUrlTimeoutValue", 30000);
        super.loadUrl("file:///android_asset/www/index.html");
        setIntegerProperty("splashscreen", R.drawable.splashscreen);
    }
}