const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  User,
  Category,
  Ad,
  Review,
  FeaturedCategory,
  Navigation,
  Feature,
  Addons,
} = require("../models");

const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash("password123", 8);

  const users = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
      isIdVerified: true,
      addressLine1: "123 Main St",
      city: "New York",
      zipCode: "10001",
    },
    {
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah@example.com",
      password: hashedPassword,
      role: "user",
      isEmailVerified: true,
      isIdVerified: true,
      addressLine1: "456 Oak Ave",
      city: "Los Angeles",
      zipCode: "90001",
    },
    {
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike@example.com",
      password: hashedPassword,
      role: "user",
      isEmailVerified: true,
      isIdVerified: false,
      addressLine1: "789 Pine Rd",
      city: "Chicago",
      zipCode: "60601",
    },
    {
      firstName: "Emily",
      lastName: "Brown",
      email: "emily@example.com",
      password: hashedPassword,
      role: "user",
      isEmailVerified: true,
      isIdVerified: true,
      addressLine1: "321 Elm St",
      city: "Houston",
      zipCode: "77001",
    },
    {
      firstName: "David",
      lastName: "Martinez",
      email: "david@example.com",
      password: hashedPassword,
      role: "user",
      isEmailVerified: true,
      isIdVerified: true,
      addressLine1: "654 Maple Dr",
      city: "Phoenix",
      zipCode: "85001",
    },
  ];

  await User.insertMany(users);
  console.log("Users seeded successfully");
};

const seedCategories = async () => {
  const categories = [
    {
      name: "Electronics",
      description: "Electronic devices and gadgets",
      icon: "pi-desktop",
    },
    {
      name: "Vehicles",
      description: "Cars, bikes, and other vehicles",
      icon: "pi-car",
    },
    {
      name: "Real Estate",
      description: "Properties and spaces",
      icon: "pi-home",
    },
    {
      name: "Tools & Equipment",
      description: "Tools and equipment for rent",
      icon: "pi-wrench",
    },
    {
      name: "Sports & Recreation",
      description: "Sports equipment and recreational items",
      icon: "pi-bolt",
    },
    {
      name: "Party & Events",
      description: "Party supplies and event equipment",
      icon: "pi-star",
    },
  ];

  await Category.insertMany(categories);
  console.log("Categories seeded successfully");
};

const seedAds = async () => {
  const users = await User.find({ role: "user" });
  const categories = await Category.find();

  if (users.length === 0 || categories.length === 0) {
    console.log("Please seed users and categories first");
    return;
  }

  const now = new Date();
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );
  const lastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7,
  );

  const ads = [
    {
      userId: users[0]._id,
      title: "Professional Camera Kit",
      description: "High-quality DSLR camera with lenses and accessories",
      category: categories[0]._id,
      price: 150,
      rentFrequency: "daily",
      priceType: "Fixed",
      rentType: "offered",
      status: "active",
      mainImage: "camera.jpg",
      subImages: ["camera1.jpg", "camera2.jpg"],
      createdDate: lastMonth,
      approvedDate: lastMonth,
      expirationDate: new Date(
        now.getFullYear(),
        now.getMonth() + 2,
        now.getDate(),
      ),
      totalAddonCharge: 25,
    },
    {
      userId: users[1]._id,
      title: "Luxury Sedan Car",
      description: "Premium sedan for special occasions",
      category: categories[1]._id,
      price: 200,
      rentFrequency: "daily",
      priceType: "Fixed",
      rentType: "offered",
      status: "active",
      mainImage: "car.jpg",
      subImages: ["car1.jpg", "car2.jpg"],
      createdDate: lastWeek,
      approvedDate: lastWeek,
      expirationDate: new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
      ),
      totalAddonCharge: 50,
    },
    {
      userId: users[2]._id,
      title: "Mountain Bike",
      description: "High-performance mountain bike for trails",
      category: categories[4]._id,
      price: 40,
      rentFrequency: "daily",
      priceType: "Fixed",
      rentType: "offered",
      status: "active",
      mainImage: "bike.jpg",
      subImages: ["bike1.jpg"],
      createdDate: now,
      approvedDate: now,
      expirationDate: new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
      ),
      totalAddonCharge: 15,
    },
    {
      userId: users[3]._id,
      title: "Power Drill Set",
      description: "Complete power drill set with accessories",
      category: categories[3]._id,
      price: 30,
      rentFrequency: "weekly",
      priceType: "Fixed",
      rentType: "offered",
      status: "active",
      mainImage: "drill.jpg",
      subImages: [],
      createdDate: lastWeek,
      approvedDate: lastWeek,
      expirationDate: new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
      ),
      totalAddonCharge: 10,
    },
    {
      userId: users[0]._id,
      title: "Party Tent",
      description: "Large party tent for outdoor events",
      category: categories[5]._id,
      price: 100,
      rentFrequency: "daily",
      priceType: "Negotiable",
      rentType: "offered",
      status: "active",
      mainImage: "tent.jpg",
      subImages: ["tent1.jpg", "tent2.jpg"],
      createdDate: lastMonth,
      approvedDate: lastMonth,
      expirationDate: new Date(
        now.getFullYear(),
        now.getMonth() + 2,
        now.getDate(),
      ),
      totalAddonCharge: 30,
    },
    {
      userId: users[1]._id,
      title: "Gaming Laptop",
      description: "High-end gaming laptop for rent",
      category: categories[0]._id,
      price: 80,
      rentFrequency: "weekly",
      priceType: "Fixed",
      rentType: "offered",
      status: "pending",
      mainImage: "laptop.jpg",
      subImages: [],
      createdDate: now,
      totalAddonCharge: 20,
    },
    {
      userId: users[2]._id,
      title: "Projector & Screen",
      description: "Professional projector with large screen",
      category: categories[0]._id,
      price: 120,
      rentFrequency: "daily",
      priceType: "Fixed",
      rentType: "offered",
      status: "active",
      mainImage: "projector.jpg",
      subImages: ["projector1.jpg"],
      createdDate: lastMonth,
      approvedDate: lastMonth,
      expirationDate: new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
      ),
      totalAddonCharge: 35,
    },
    {
      userId: users[3]._id,
      title: "Electric Scooter",
      description: "Eco-friendly electric scooter",
      category: categories[1]._id,
      price: 25,
      rentFrequency: "daily",
      priceType: "Fixed",
      rentType: "offered",
      status: "active",
      mainImage: "scooter.jpg",
      subImages: [],
      createdDate: lastWeek,
      approvedDate: lastWeek,
      expirationDate: new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
      ),
      totalAddonCharge: 5,
    },
  ];

  await Ad.insertMany(ads);
  console.log("Ads seeded successfully");
};

const seedSectionAds = async (countPerSection = 3) => {
  const users = await User.find({ role: "user" });
  const categories = await Category.find();

  if (users.length === 0 || categories.length === 0) {
    console.log("Please seed users and categories first");
    return;
  }

  // Choose a default category for demo entries
  const defaultCat = categories[0]._id;

  const bases = {
    rent: {
      title: "Canon D3",
      description: "Full-frame camera available for rent",
      price: 1000,
      rentFrequency: "hourly",
      mainImage: "camera.jpg",
    },
    hire: {
      title: "Professional Baker (Hire)",
      description: "Experienced professional available for hire",
      price: 5000,
      mainImage: "cake.jpg",
    },
    buy: {
      title: "Local Bakery Listing",
      description: "Established local bakery listing for purchase",
      price: 1500000,
      mainImage: "cake.jpg",
    },
  };

  const sections = Object.keys(bases);
  for (const section of sections) {
    const base = bases[section];
    for (let i = 1; i <= countPerSection; i++) {
      const title = `${base.title} — Demo ${i}`;
      const candidate = {
        userId: users[(i - 1) % users.length]._id,
        title,
        description: base.description,
        category: defaultCat,
        price: Math.round(base.price * (1 + (i - 1) * 0.05)),
        priceType: "Fixed",
        rentType: "offered",
        status: "active",
        mainImage: base.mainImage,
        section,
      };

      // section-specific fields
      if (section === "rent" || section === "hire") {
        candidate.rentFrequency = base.rentFrequency || "daily";
      }
      if (section === "buy") {
        candidate.yearEstablished = 2020;
      }

      const exists = await Ad.findOne({ title: candidate.title });
      if (exists) {
        console.log(`Sample ad already exists, skipping: ${candidate.title}`);
        continue;
      }

      await Ad.create(candidate);
      console.log(
        `Inserted sample ad: ${candidate.title} (section: ${section})`,
      );
    }
  }
};

// Normalize existing ads by ensuring `section` is set and reasonably inferred
const normalizeAdSections = async () => {
  const ads = await Ad.find({});
  let updatedCount = 0;

  const inferSection = (ad) => {
    const text = `${ad.title || ""} ${ad.description || ""}`.toLowerCase();

    if (ad.section) {
      const normalizedSection = String(ad.section).toLowerCase();
      if (!["rent", "hire", "buy"].includes(normalizedSection)) {
        return "buy";
      }
      return normalizedSection;
    }
    if (ad.rentFrequency) return "rent";
    if (/\b(hire|service|freelancer|freelance|contractor)\b/.test(text))
      return "hire";
    if (/\b(campaign|fundraising|preorder|launch)\b/.test(text)) return "buy";
    if (
      ad.platformType ||
      ad.platformFollowers ||
      ad.yearEstablished ||
      ad.avgRevenueMonthly ||
      ad.avgProfitYearly ||
      ad.equityPercentage
    ) {
      return "buy";
    }
    // fallback to rent for safety
    return "rent";
  };

  for (const ad of ads) {
    const targetSection = inferSection(ad);
    const updates = {};

    if (!ad.section || ad.section !== targetSection) {
      updates.section = targetSection;
    }

    // If it's a rent/hire ad and rentFrequency is missing but price exists, set a sensible default
    if (
      (targetSection === "rent" || targetSection === "hire") &&
      !ad.rentFrequency &&
      ad.price
    ) {
      updates.rentFrequency = ad.rentFrequency || "daily";
    }

    // Keep optional business metrics nullable for buy entries created from legacy data
    if (targetSection === "buy") {
      if (typeof ad.yearEstablished === "undefined")
        updates.yearEstablished = ad.yearEstablished || null;
      if (typeof ad.platformType === "undefined")
        updates.platformType = ad.platformType || null;
      if (typeof ad.platformFollowers === "undefined")
        updates.platformFollowers = ad.platformFollowers || null;
      if (typeof ad.avgRevenueMonthly === "undefined")
        updates.avgRevenueMonthly = ad.avgRevenueMonthly ?? null;
      if (typeof ad.avgProfitYearly === "undefined")
        updates.avgProfitYearly = ad.avgProfitYearly ?? null;
      if (typeof ad.equityPercentage === "undefined")
        updates.equityPercentage = ad.equityPercentage ?? null;
    }

    if (Object.keys(updates).length > 0) {
      await Ad.updateOne({ _id: ad._id }, { $set: updates });
      updatedCount++;
      console.log(
        `Updated ad ${ad._id} -> section=${updates.section || ad.section}`,
      );
    }
  }

  console.log(`normalizeAdSections: updated ${updatedCount} ads`);
  return updatedCount;
};

const seedFeaturedCategories = async () => {
  const categories = await Category.find();

  if (categories.length === 0) {
    console.log("Please seed categories first");
    return;
  }

  const featuredCategories = [
    {
      category: categories[0]._id,
      image: "featured-electronics.jpg",
      displayOrder: 1,
    },
    {
      category: categories[1]._id,
      image: "featured-vehicles.jpg",
      displayOrder: 2,
    },
    {
      category: categories[4]._id,
      image: "featured-sports.jpg",
      displayOrder: 3,
    },
  ];

  await FeaturedCategory.insertMany(featuredCategories);
  console.log("Featured categories seeded successfully");
};

// --- seed categories scoped to sections (non-destructive) ---
const seedSectionCategories = async () => {
  const existing = await Category.find();
  if (existing.length === 0) {
    console.log("Please seed base categories first (run seedCategories)");
    return;
  }

  // helper to update sections on existing categories only — do NOT insert new categories (avoids subCategory index issues)
  const attachSectionsToExisting = async (name, sections) => {
    const found = await Category.findOne({ name });
    if (!found) {
      console.log(`Category not found (skipping create): ${name}`);
      return null;
    }
    const current = found.sections || [];
    const need = sections.filter((s) => !current.includes(s));
    if (need.length > 0) {
      found.sections = Array.from(
        new Set([...(found.sections || []), ...sections]),
      );
      await found.save();
      console.log(`Updated sections for existing category: ${name}`);
    } else {
      console.log(`Category already has sections, skipping: ${name}`);
    }
    return found;
  };

  // Heuristic pass: tag existing categories with sections based on name keywords
  const allCats = await Category.find();
  const heuristics = [
    { match: /camera|photo|photography|electronics|cameras/i, section: "rent" },
    { match: /camp|tent|hiking|outdoor|sports|bicycle|bike/i, section: "rent" },
    { match: /tool|drill|equipment|power tools/i, section: "rent" },

    {
      match: /service|services|staff|cleaning|repair|transport|driver/i,
      section: "hire",
    },

    {
      match: /restaurant|food|bakery|cafe|real estate|retail|store/i,
      section: "buy",
    },

    {
      match: /youtube|channel|social|saas|franchise|equity|revenue/i,
      section: "buy",
    },

    {
      match: /campaign|community|charity|product launch|fundraising/i,
      section: "buy",
    },
  ];

  for (const cat of allCats) {
    const name = cat.name || "";
    const toAdd = new Set(cat.sections || []);
    heuristics.forEach((h) => {
      if (h.match.test(name)) toAdd.add(h.section);
    });
    if (
      toAdd.size > 0 &&
      JSON.stringify(Array.from(toAdd)) !== JSON.stringify(cat.sections || [])
    ) {
      cat.sections = Array.from(toAdd);
      await cat.save();
      console.log(
        `Tagged category '${cat.name}' with sections: ${cat.sections.join(",")}`,
      );
    }
  }

  console.log("Heuristic tagging complete");

  console.log("Section-scoped categories seeded/updated");
};

const seedReviews = async () => {
  const users = await User.find({ role: "user" });
  const ads = await Ad.find({ status: "active" }).limit(5);

  if (users.length === 0 || ads.length === 0) {
    console.log("Please seed users and ads first");
    return;
  }

  const reviews = [];
  for (let i = 0; i < Math.min(ads.length, 5); i++) {
    reviews.push({
      userId: users[i % users.length]._id,
      adId: ads[i]._id,
      rating: 4 + Math.random(), // 4-5 stars
      comment: "Great experience! Highly recommended.",
    });
  }

  await Review.insertMany(reviews);
  console.log("Reviews seeded successfully");
};

const seedFeatures = async () => {
  const features = [
    {
      name: "Featured Listing",
      description: "Make your ad stand out",
      iconStr: "star.png",
      price: 10,
    },
    {
      name: "Top Position",
      description: "Stay at the top of search results",
      iconStr: "top.png",
      price: 15,
    },
    {
      name: "Homepage Showcase",
      description: "Display on homepage",
      iconStr: "home.png",
      price: 20,
    },
  ];

  await Feature.insertMany(features);
  console.log("Features seeded successfully");
};

const seedAddons = async () => {
  const addons = [
    {
      name: "Premium Support",
      description: "24/7 customer support",
      icon: "support.png",
      price: 5,
    },
    {
      name: "Extended Duration",
      description: "Extend your listing by 30 days",
      icon: "calendar.png",
      price: 8,
    },
    {
      name: "Verified Badge",
      description: "Get a verified seller badge",
      icon: "badge.png",
      price: 12,
    },
  ];

  await Addons.insertMany(addons);
  console.log("Addons seeded successfully");
};

const seedNavigations = async () => {
  const categories = await Category.find();

  if (categories.length === 0) {
    console.log("Please seed categories first");
    return;
  }

  const navigations = categories.slice(0, 4).map((cat) => ({
    category: cat._id,
    isActive: true,
  }));

  await Navigation.insertMany(navigations);
  console.log("Navigations seeded successfully");
};

const clearData = async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Ad.deleteMany({});
  await Review.deleteMany({});
  await FeaturedCategory.deleteMany({});
  await Feature.deleteMany({});
  await Addons.deleteMany({});
  await Navigation.deleteMany({});
  console.log("All data cleared");
};

const seedAll = async () => {
  try {
    console.log("Starting database seeding...");

    // Clear existing data
    await clearData();

    // Seed in order (respecting dependencies)
    await seedUsers();
    await seedCategories();
    await seedFeatures();
    await seedAddons();
    await seedAds();
    await seedReviews();
    await seedFeaturedCategories();
    await seedNavigations();

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

module.exports = {
  seedAll,
  clearData,
  seedUsers,
  seedCategories,
  seedAds,
  seedReviews,
  seedFeaturedCategories,
  seedFeatures,
  seedAddons,
  seedNavigations,
  seedSectionAds,
  seedSectionCategories,
  normalizeAdSections,
};
