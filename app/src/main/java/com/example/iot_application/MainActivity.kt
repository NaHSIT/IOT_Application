package com.example.iot_application

import android.os.Bundle
import androidx.activity.OnBackPressedCallback
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import android.annotation.SuppressLint

import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.content.Context
import android.content.Intent
import android.webkit.JavascriptInterface
import androidx.core.content.FileProvider
import java.io.File
import java.io.FileOutputStream

@Suppress("unused", "SpellCheckingInspection")
class WebAppInterface(private val context: Context) {
    @JavascriptInterface
    fun shareCSV(fileName: String, content: String) {
        try {
            // Save file to cache directory
            val cachePath = File(context.cacheDir, "shared_files")
            cachePath.mkdirs()
            val newFile = File(cachePath, fileName)
            FileOutputStream(newFile).use { stream ->
                stream.write(content.toByteArray(Charsets.UTF_8))
            }

            // Get content URI using FileProvider
            val contentUri = FileProvider.getUriForFile(
                context, 
                "${context.packageName}.fileprovider", 
                newFile
            )

            // Create share intent
            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "text/csv"
                putExtra(Intent.EXTRA_STREAM, contentUri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }

            // Show chooser
            context.startActivity(Intent.createChooser(shareIntent, "导出/分享历史数据"))
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        
        webView = findViewById(R.id.webView)
        
        // WebView Settings
        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.allowFileAccess = true
        webSettings.allowContentAccess = true
        
        // 允许跨域访问 (解决 OneNet API 跨域问题)
        @Suppress("DEPRECATION")
        webSettings.allowFileAccessFromFileURLs = true
        @Suppress("DEPRECATION")
        webSettings.allowUniversalAccessFromFileURLs = true
        
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = android.webkit.WebChromeClient()
        
        // Add JavaScript Interface to support native file sharing
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidApp")
        
        // Load the local index file
        webView.loadUrl("file:///android_asset/www/login.html")

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Handle back button presses using OnBackPressedDispatcher
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    // If we can't go back in WebView, let the system handle the back button
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                    isEnabled = true
                }
            }
        })
    }
}