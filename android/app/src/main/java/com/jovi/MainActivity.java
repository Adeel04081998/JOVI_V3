package com.jovi;

import com.facebook.react.ReactActivity;
import com.jovi.SplashScreen; // Import this.
import android.os.Bundle; // Import this.
import android.util.Log;

public class MainActivity extends ReactActivity {
    //For Splash Screen
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
//        super.onCreate(savedInstanceState);
        super.onCreate(null);
    }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "jovi";
  }
}
