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

    @Value("${kiranaconnect.google.search.apiKey}")
    private String apiKey;

    @Value("${kiranaconnect.google.search.cxId}")
    private String searchEngineId;

    @GetMapping("/search")
    public List<String> searchImages(@RequestParam String query) {
        // Fallback to Unsplash if no Google Key is provided or it's still the placeholder
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_GOOGLE_API_KEY")) {
            System.out.println("Using Unsplash fallback: No API key configured.");
            return searchUnsplash(query);
        }

        List<String> imageUrls = new ArrayList<>();
        
        try {
            // Step 1: Search specifically on Amazon.in for high priority
            String amazonQuery = query + " site:amazon.in";
            List<String> amazonResults = fetchFromGoogle(amazonQuery);
            
            if (amazonResults != null) {
                imageUrls.addAll(amazonResults);
            }

            // Step 2: If we have less than 5 results from Amazon, supplement with general search
            if (imageUrls.size() < 5) {
                List<String> generalResults = fetchFromGoogle(query);
                if (generalResults != null) {
                    for (String url : generalResults) {
                        if (!imageUrls.contains(url) && imageUrls.size() < 10) {
                            imageUrls.add(url);
                        }
                    }
                }
            }

            // If still no results after Google attempts, something is wrong with the key/cx or query
            if (imageUrls.isEmpty()) {
                System.out.println("Google returned 0 results. Falling back to Unsplash.");
                return searchUnsplash(query);
            }

            // Trim to top 10
            if (imageUrls.size() > 10) {
                imageUrls = imageUrls.subList(0, 10);
            }

        } catch (Exception e) {
            System.err.println("Unexpected Image Search error: " + e.getMessage());
            return searchUnsplash(query);
        }
        
        return imageUrls;
    }

    private List<String> fetchFromGoogle(String query) {
        List<String> urls = new ArrayList<>();
        try {
            String url = String.format(
                "https://www.googleapis.com/customsearch/v1?q=%s&searchType=image&num=10&key=%s&cx=%s",
                (query + " site:amazon.in").replace(" ", "+"), apiKey, searchEngineId
            );

            String response = restTemplate.getForObject(url, String.class);
            if (response != null) {
                JSONObject json = new JSONObject(response);
                if (json.has("items")) {
                    JSONArray items = json.getJSONArray("items");
                    for (int i = 0; i < items.length(); i++) {
                        urls.add(items.getJSONObject(i).getString("link"));
                    }
                }
            }
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("Google API Error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
            // Return null to signal a failure to the caller so it can fallback
            return null;
        } catch (Exception e) {
            System.err.println("Fetch error for [" + query + "]: " + e.getMessage());
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
