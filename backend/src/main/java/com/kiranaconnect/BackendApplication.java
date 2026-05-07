package com.kiranaconnect;

import com.kiranaconnect.models.Product;
import com.kiranaconnect.models.Role;
import com.kiranaconnect.models.User;
import com.kiranaconnect.repositories.ProductRepository;
import com.kiranaconnect.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Users initialization
			if (!userRepository.existsByEmail("admin@test.com")) {
				userRepository.save(User.builder()
						.name("Admin User").shopName("Admin Shop").email("admin@test.com")
						.password(passwordEncoder.encode("admin123")).role(Role.ADMIN).address("Admin Office").build());
			}
			if (!userRepository.existsByEmail("vendor@test.com")) {
				userRepository.save(User.builder()
						.name("Vendor User").shopName("Kirana Store").email("vendor@test.com")
						.password(passwordEncoder.encode("vendor123")).role(Role.VENDOR).address("Main Street").build());
			}

			// Products initialization (Seed only if empty)
			if (productRepository.count() == 0) {
				System.out.println(">>> Seeding initial product catalog...");
				List<Product> products = new ArrayList<>();

				// Use Placehold.co - 100% reliable, includes product name
				String base = "https://placehold.co/400x400/6366f1/white?text=";

				// --- HUL ---
				products.add(createProduct("Surf Excel Matic 1kg", "Powerful stain removal", "Laundry", 210.0, 12, 500, base + "Surf+Excel"));
				products.add(createProduct("Dove Cream Bar 75g", "Soft and smooth skin", "Personal Care", 48.0, 48, 1000, base + "Dove"));
				products.add(createProduct("Red Label Tea 500g", "Great taste and aroma", "Beverages", 260.0, 20, 300, base + "Red+Label"));
				products.add(createProduct("Horlicks 500g", "Health drink for kids", "Beverages", 245.0, 15, 200, base + "Horlicks"));
				products.add(createProduct("Lifebuoy Total 125g", "Germ protection soap", "Personal Care", 35.0, 72, 2000, base + "Lifebuoy"));
				products.add(createProduct("Vim Dishwash Bar 155g", "Degreaser for utensils", "Cleaning", 10.0, 100, 5000, base + "Vim+Bar"));
				products.add(createProduct("Pepsodent Germi Check 150g", "Complete cavity protection", "Personal Care", 95.0, 24, 800, base + "Pepsodent"));
				products.add(createProduct("Knorr Tomato Soup 50g", "Instant delicious soup", "Snacks", 55.0, 50, 400, base + "Knorr+Soup"));
				products.add(createProduct("Lux Velvet Touch 100g", "Fragrant beauty soap", "Personal Care", 40.0, 60, 1200, base + "Lux+Soap"));
				products.add(createProduct("Rin Detergent Powder 1kg", "Whiter and brighter clothes", "Laundry", 85.0, 15, 600, base + "Rin+Powder"));

				// --- Nestle ---
				products.add(createProduct("Maggi Masala Noodles 70g", "Classic favorite noodles", "Snacks", 14.0, 96, 5000, base + "Maggi"));
				products.add(createProduct("Nescafe Classic 50g", "Pure instant coffee", "Beverages", 165.0, 12, 400, base + "Nescafe"));
				products.add(createProduct("KitKat 4 Finger 38g", "Crispy wafer chocolate", "Snacks", 25.0, 48, 1500, base + "KitKat"));
				products.add(createProduct("Nestle Munch 10g", "Crunchy wafer snack", "Snacks", 5.0, 200, 3000, base + "Munch"));
				products.add(createProduct("Everyday Milk Powder 400g", "Whitener for tea/coffee", "Grocery", 230.0, 10, 250, base + "Milk+Powder"));
				products.add(createProduct("Milkybar 25g", "Creamy white treat", "Snacks", 20.0, 60, 1000, base + "Milkybar"));
				products.add(createProduct("Nestle Milkmaid 400g", "Sweetened condensed milk", "Grocery", 144.0, 12, 350, base + "Milkmaid"));
				products.add(createProduct("Nestea Lemon 400g", "Refreshing iced tea mix", "Beverages", 180.0, 10, 150, base + "Nestea"));
				products.add(createProduct("Nestle Ceregrow 300g", "Multigrain cereal for kids", "Grocery", 295.0, 8, 100, base + "Ceregrow"));
				products.add(createProduct("Nan Pro 1 400g", "Infant formula milk", "Grocery", 725.0, 6, 80, base + "Nan+Pro"));

				// --- ITC ---
				products.add(createProduct("Aashirvaad Atta 10kg", "Whole wheat flour", "Grocery", 440.0, 5, 200, base + "Aashirvaad"));
				products.add(createProduct("Sunfeast Dark Fantasy 100g", "Choco filled cookies", "Snacks", 40.0, 30, 800, base + "Dark+Fantasy"));
				products.add(createProduct("Bingo! Mad Angles 80g", "Triangle potato chips", "Snacks", 20.0, 50, 1200, base + "Bingo"));
				products.add(createProduct("Yippee! Noodles 70g", "Long & non-sticky noodles", "Snacks", 12.0, 96, 2500, base + "Yippee"));
				products.add(createProduct("Classmate Notebook A4", "Premium quality paper", "Stationery", 60.0, 40, 1000, base + "Classmate"));
				products.add(createProduct("Fiama Gel Bar 125g", "Exotic dream soap", "Personal Care", 65.0, 48, 600, base + "Fiama"));
				products.add(createProduct("Savlon Handwash 500g", "Effective germ protection", "Personal Care", 185.0, 12, 300, base + "Savlon"));
				products.add(createProduct("Mangaldeep Agarbatti", "Scented incense sticks", "Pooja Needs", 15.0, 100, 2000, base + "Mangaldeep"));
				products.add(createProduct("Sunfeast Marie Light 250g", "Crunchy wheat biscuits", "Snacks", 30.0, 40, 900, base + "Marie+Light"));
				products.add(createProduct("Vivel Aloe Vera 100g", "Soft and fresh soap", "Personal Care", 30.0, 60, 1100, base + "Vivel"));

				// --- P&G ---
				products.add(createProduct("Ariel Matic 1kg", "Superior stain removal", "Laundry", 240.0, 10, 400, base + "Ariel"));
				products.add(createProduct("Tide Plus 1kg", "Whiter and brighter", "Laundry", 115.0, 15, 600, base + "Tide"));
				products.add(createProduct("Whisper Ultra Clean XL", "Wings sanitary pads", "Personal Care", 160.0, 20, 1000, base + "Whisper"));
				products.add(createProduct("Gillette Mach 3 Razor", "Close and comfortable shave", "Personal Care", 450.0, 5, 200, base + "Gillette"));
				products.add(createProduct("Head & Shoulders 180ml", "Anti-dandruff shampoo", "Personal Care", 185.0, 12, 500, base + "Head+Shoulders"));
				products.add(createProduct("Pantene Hairfall 180ml", "Pro-V formula shampoo", "Personal Care", 165.0, 12, 450, base + "Pantene"));
				products.add(createProduct("Oral-B Toothbrush", "Soft bristles cleaner", "Personal Care", 45.0, 60, 1500, base + "Oral-B"));
				products.add(createProduct("Vicks Vaporub 50g", "Relief from cold/cough", "Health", 155.0, 10, 300, base + "Vicks"));
				products.add(createProduct("Pampers Baby Wipes", "Gentle skin cleaning", "Baby Care", 199.0, 10, 400, base + "Pampers"));
				products.add(createProduct("Olay Regenerist 50g", "Anti-aging cream", "Personal Care", 1200.0, 2, 50, base + "Olay"));

				// --- Cadbury ---
				products.add(createProduct("Dairy Milk Silk 60g", "Smooth and creamy chocolate", "Snacks", 80.0, 24, 1000, base + "Dairy+Milk"));
				products.add(createProduct("Cadbury 5 Star 20g", "Caramel filled chocolate", "Snacks", 10.0, 100, 3000, "https://placehold.co/400x400/6366f1/white?text=5+Star"));
				products.add(createProduct("Oreo Biscuits 120g", "Choco sandwich cookies", "Snacks", 35.0, 48, 1200, base + "Oreo"));
				products.add(createProduct("Bournvita 500g", "Nutrition chocolate drink", "Beverages", 225.0, 15, 400, base + "Bournvita"));
				products.add(createProduct("Cadbury Perk 15g", "Light wafer snack", "Snacks", 5.0, 200, 5000, base + "Perk"));
				products.add(createProduct("Cadbury Gems 10g", "Colorful chocolate buttons", "Snacks", 5.0, 250, 4000, base + "Gems"));
				products.add(createProduct("Bournville Dark 80g", "Rich cocoa chocolate", "Snacks", 100.0, 20, 300, base + "Bournville"));
				products.add(createProduct("Tang Orange 500g", "Instant fruit drink", "Beverages", 160.0, 12, 200, base + "Tang"));
				products.add(createProduct("Halls Cool Mint", "Refreshing throat lozenge", "Health", 1.0, 500, 10000, base + "Halls"));
				products.add(createProduct("Celebrations Gift Pack", "Assorted chocolates", "Snacks", 200.0, 10, 150, base + "Celebrations"));

				productRepository.saveAll(products);
				System.out.println(">>> Seeded 50 premium products with ultra-stable placeholder images.");
			}
		};
	}

	private Product createProduct(String name, String desc, String cat, Double price, Integer minQty, Integer stock, String img) {
		return Product.builder()
				.name(name)
				.description(desc)
				.category(cat)
				.wholesalePrice(price)
				.minOrderQty(minQty)
				.stockLevel(stock)
				.imageUrl(img)
				.build();
	}

}
