package com.kiranaconnect.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin/images")
@PreAuthorize("hasAuthority('ADMIN')")
public class ImageSearchController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${kiranaconnect.serpapi.key}")
    private String serpApiKey;

    @GetMapping("/search")
    public List<String> searchImages(@RequestParam String query) {
        // Log key info (masked) for debugging
        if (serpApiKey != null && serpApiKey.length() > 6) {
            String maskedKey = serpApiKey.substring(0, 3) + "..." + serpApiKey.substring(serpApiKey.length() - 3);
            System.out.println("SerpApi search attempt with key: [" + maskedKey + "] (Length: " + serpApiKey.length() + ")");
        } else {
            System.out.println("SerpApi key is invalid or too short: " + (serpApiKey == null ? "NULL" : "[" + serpApiKey + "]"));
        }

        // Fallback to Unsplash if no SerpApi Key is provided
        if (serpApiKey == null || serpApiKey.isEmpty() || serpApiKey.equals("YOUR_SERPAPI_KEY")) {
            System.out.println("Using Unsplash fallback: No SerpApi key configured.");
            return searchUnsplash(query);
        }

        List<String> imageUrls = new ArrayList<>();
        
        try {
            // Step 1: Search specifically on Amazon.in for high priority using SerpApi
            String amazonQuery = query + " site:amazon.in";
            List<String> amazonResults = fetchFromSerpApi(amazonQuery);
            
            if (amazonResults != null) {
                imageUrls.addAll(amazonResults);
            }

            // Step 2: Supplement with general search if needed
            if (imageUrls.size() < 5) {
                List<String> generalResults = fetchFromSerpApi(query);
                if (generalResults != null) {
                    for (String url : generalResults) {
                        if (!imageUrls.contains(url) && imageUrls.size() < 10) {
                            imageUrls.add(url);
                        }
                    }
                }
            }

            if (imageUrls.isEmpty()) {
                return searchUnsplash(query);
            }

            if (imageUrls.size() > 10) {
                imageUrls = imageUrls.subList(0, 10);
            }

        } catch (Exception e) {
            System.err.println("Unexpected Image Search error: " + e.getMessage());
            return searchUnsplash(query);
        }
        
        return imageUrls;
    }

    private List<String> fetchFromSerpApi(String query) {
        List<String> urls = new ArrayList<>();
        // Trim key to handle accidental spaces in environment variables
        String cleanKey = serpApiKey != null ? serpApiKey.trim() : "";
        
        try {
            String url = String.format(
                "https://serpapi.com/search.json?engine=google_images&q=%s&api_key=%s",
                query.replace(" ", "+"), cleanKey
            );

            String response = restTemplate.getForObject(url, String.class);
            if (response != null) {
                JSONObject json = new JSONObject(response);
                if (json.has("images_results")) {
                    JSONArray items = json.getJSONArray("images_results");
                    for (int i = 0; i < items.length() && i < 10; i++) {
                        urls.add(items.getJSONObject(i).getString("original"));
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("SerpApi Fetch error for [" + query + "]: " + e.getMessage());
            return null;
        }
        return urls;
    }

    private List<String> searchUnsplash(String query) {
        List<String> urls = new ArrayList<>();
        // This is a much better fallback than LoremFlickr - it returns 10 unique, high-quality images
        for (int i = 0; i < 10; i++) {
            urls.add("https://source.unsplash.com/featured/400x400/?" + query.replace(" ", ",") + "&sig=" + i);
        }
        return urls;
    }
}
