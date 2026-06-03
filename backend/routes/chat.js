// routes/chat.js
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();

// Import your MongoDB models
const Blog = require('../models/Blog');
const Booking = require('../models/Booking');
const Destination = require('../models/destination');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const TourPackage = require('../models/TourPackage');

// Load canned replies from JSON file
let replyTable;
try {
  replyTable = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../cannedReplies.json'), 'utf-8')
  );
} catch (error) {
  console.error('Could not load cannedReplies.json, using fallback');
  replyTable = {
    greeting: {
      triggers: ["hi", "hello", "hey"],
      reply: "Hello! 👋 How can I help you plan your Karnataka adventure today?"
    },
    fallback: {
      reply: "I'm here to help with Namma Trip tour-package questions. Let me know what you need!"
    }
  };
}

// Session management with custom ID generation
const sessions = new Map();

// Custom session ID generator
function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const randomBytes = crypto.randomBytes(8).toString('hex');
  const userAgent = 'web';
  return `session_${timestamp}_${randomBytes}_${userAgent}`;
}

// Database query functions with your actual models
const dbQueries = {
  // Blog queries
  async blogPosts(limit = 5) {
    try {
      const blogs = await Blog.find()
        .select('title content author image createdAt')
        .sort({ createdAt: -1 })
        .limit(limit);
      
      if (blogs.length === 0) return null;
      
      let reply = "📖 Latest travel blogs and tips:\n\n";
      blogs.forEach((blog, index) => {
        reply += `${index + 1}. **${blog.title}**\n`;
        reply += `   By: ${blog.author}\n`;
        reply += `   ${blog.content.substring(0, 100)}...\n`;
        reply += `   Posted: ${blog.createdAt.toDateString()}\n\n`;
      });
      
      reply += "📚 Read more blogs: http://localhost:5173/user-blog";
      return reply;
    } catch (error) {
      console.error('Database error fetching blogs:', error);
      return null;
    }
  },

  // Destination queries
  async destinations(limit = 8) {
    try {
      const destinations = await Destination.find()
        .select('dTitle dDescription dDistrict dProvince clickCount')
        .sort({ clickCount: -1 })
        .limit(limit);
      
      if (destinations.length === 0) return null;
      
      let reply = "🏛️ Popular destinations in Karnataka:\n\n";
      destinations.forEach((dest, index) => {
        reply += `${index + 1}. **${dest.dTitle}**\n`;
        reply += `   📍 ${dest.dDistrict}, ${dest.dProvince}\n`;
        reply += `   👀 ${dest.clickCount} views\n`;
        reply += `   ${dest.dDescription.substring(0, 80)}...\n\n`;
      });
      
      reply += "🗺️ Explore more: http://localhost:5173/destinations";
      return reply;
    } catch (error) {
      console.error('Database error fetching destinations:', error);
      return null;
    }
  },

  // Equipment queries
  async equipment(type = null, limit = 6) {
    try {
      const query = type ? { equipmentType: type } : {};
      const equipment = await Equipment.find(query)
        .select('equipmentName equipmentType equipmentPrice equipmentDescription equipmentQuantity')
        .sort({ equipmentPrice: 1 })
        .limit(limit);
      
      if (equipment.length === 0) return null;
      
      let reply = `🎒 ${type ? `${type} equipment` : 'Available equipment'}:\n\n`;
      equipment.forEach((item, index) => {
        reply += `${index + 1}. **${item.equipmentName}**\n`;
        reply += `   Type: ${item.equipmentType}\n`;
        reply += `   Price: ₹${item.equipmentPrice.toLocaleString()}\n`;
        reply += `   Available: ${item.equipmentQuantity} units\n`;
        reply += `   ${item.equipmentDescription.substring(0, 60)}...\n\n`;
      });
      
      reply += "🛍️ View all equipment: http://localhost:5173/userequipment";
      return reply;
    } catch (error) {
      console.error('Database error fetching equipment:', error);
      return null;
    }
  },

  // User booking queries
  async userBookings(userId) {
    if (!userId) return "Please log in to view your bookings. 🔐";
    
    try {
      const bookings = await Booking.find({ 
        userId: new mongoose.Types.ObjectId(userId)
      })
      .select('fullName packageName packagePrice totalPrice date isPaid equipment')
      .sort({ date: -1 })
      .limit(5);
      
      if (bookings.length === 0) {
        return "You don't have any bookings yet. Would you like to explore our packages? 🌟\n\nView packages: http://localhost:5173/tour-packages";
      }
      
      let reply = "📋 Your recent bookings:\n\n";
      bookings.forEach((booking, index) => {
        reply += `${index + 1}. **${booking.packageName}**\n`;
        reply += `   Name: ${booking.fullName}\n`;
        reply += `   Travel Date: ${booking.date.toDateString()}\n`;
        reply += `   Package Price: ₹${booking.packagePrice.toLocaleString()}\n`;
        reply += `   Total Amount: ₹${booking.totalPrice.toLocaleString()}\n`;
        reply += `   Payment Status: ${booking.isPaid ? '✅ Paid' : '⏳ Pending'}\n`;
        
        if (booking.equipment && booking.equipment.length > 0) {
          reply += `   Equipment: ${booking.equipment.map(eq => eq.name).join(', ')}\n`;
        }
        reply += '\n';
      });
      
      reply += "📞 Need help with your booking? Visit: http://localhost:5173/tickets";
      return reply;
    } catch (error) {
      console.error('Database error fetching bookings:', error);
      return "Sorry, I couldn't retrieve your bookings right now. Please try again later.";
    }
  },

  // Search destinations by district/province
  async searchDestinations(query) {
    try {
      const destinations = await Destination.find({
        $or: [
          { dTitle: { $regex: query, $options: 'i' } },
          { dDescription: { $regex: query, $options: 'i' } },
          { dDistrict: { $regex: query, $options: 'i' } },
          { dProvince: { $regex: query, $options: 'i' } }
        ]
      })
      .select('dTitle dDistrict dProvince dDescription clickCount')
      .sort({ clickCount: -1 })
      .limit(5);

      if (destinations.length === 0) return null;

      let reply = `🔍 Found ${destinations.length} destinations for "${query}":\n\n`;
      destinations.forEach((dest, index) => {
        reply += `${index + 1}. **${dest.dTitle}**\n`;
        reply += `   📍 ${dest.dDistrict}, ${dest.dProvince}\n`;
        reply += `   ${dest.dDescription.substring(0, 80)}...\n\n`;
      });

      reply += "🗺️ View all destinations: http://localhost:5173/destinations";
      return reply;
    } catch (error) {
      console.error('Database error searching destinations:', error);
      return null;
    }
  },

  // Get popular districts
  async popularDistricts() {
    try {
      const districts = await Destination.aggregate([
        {
          $group: {
            _id: "$dDistrict",
            province: { $first: "$dProvince" },
            totalViews: { $sum: "$clickCount" },
            destinationCount: { $sum: 1 }
          }
        },
        { $sort: { totalViews: -1 } },
        { $limit: 6 }
      ]);

      if (districts.length === 0) return null;

      let reply = "🏛️ Popular districts to visit:\n\n";
      districts.forEach((district, index) => {
        reply += `${index + 1}. **${district._id}**\n`;
        reply += `   Province: ${district.province}\n`;
        reply += `   ${district.destinationCount} destinations\n`;
        reply += `   ${district.totalViews} total views\n\n`;
      });

      return reply;
    } catch (error) {
      console.error('Database error fetching districts:', error);
      return null;
    }
  },

  // Search blogs
  async searchBlogs(query) {
    try {
      const blogs = await Blog.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } }
        ]
      })
      .select('title author content createdAt')
      .sort({ createdAt: -1 })
      .limit(3);

      if (blogs.length === 0) return null;

      let reply = `📚 Found ${blogs.length} blog posts about "${query}":\n\n`;
      blogs.forEach((blog, index) => {
        reply += `${index + 1}. **${blog.title}**\n`;
        reply += `   By: ${blog.author}\n`;
        reply += `   ${blog.content.substring(0, 100)}...\n`;
        reply += `   Posted: ${blog.createdAt.toDateString()}\n\n`;
      });

      reply += "📖 Read more: http://localhost:5173/user-blog";
      return reply;
    } catch (error) {
      console.error('Database error searching blogs:', error);
      return null;
    }
  },

  // ========== TRIP PLANNING FUNCTIONS FOR KARNATAKA ==========

  // Get user's name for personalization
  async getUserName(userId) {
    try {
      if (!userId) return 'there';
      const user = await User.findById(userId).select('firstName lastName');
      return user ? `${user.firstName}` : 'there';
    } catch (error) {
      return 'there';
    }
  },

  // Trip planning initiation
  async initiateTripPlanning(userId, context) {
    const userName = await this.getUserName(userId);
    return `🌟 **Welcome to Namma Trip Planner!** 🌟

Hi ${userName}! I'm excited to help you plan your perfect Karnataka adventure. 

To create a personalized itinerary, I'll need some details:

📅 **Duration**: How many days are you planning to stay?
📍 **Interests**: What type of experience interests you most?
👥 **Group Size**: How many people will be traveling?
💰 **Budget**: What's your approximate budget range?
🗓️ **Travel Dates**: When are you planning to visit?

Let's start with the **duration** - how many days would you like to spend in Karnataka?`;
  },

  // Get destinations based on user interests
  async getDestinationsByInterests(interests, duration) {
    const interestKeywords = {
      'cultural': ['temple', 'heritage', 'historical', 'ancient', 'palace', 'fort', 'monument'],
      'beach': ['beach', 'coastal', 'ocean', 'bay', 'surf', 'diving', 'gokarna', 'karwar'],
      'adventure': ['mountain', 'hiking', 'wildlife', 'safari', 'trek', 'climb', 'western ghats'],
      'nature': ['national park', 'forest', 'waterfall', 'scenic', 'bird', 'elephant', 'tiger'],
      'mixed': ['temple', 'beach', 'mountain', 'park', 'heritage', 'wildlife', 'palace']
    };

    const keywords = interestKeywords[interests.toLowerCase()] || interestKeywords['mixed'];
    const regex = new RegExp(keywords.join('|'), 'i');

    try {
      return await Destination.find({
        $or: [
          { dDescription: regex },
          { dTitle: regex }
        ]
      })
      .select('dTitle dDescription dDistrict dProvince clickCount')
      .sort({ clickCount: -1 })
      .limit(Math.min(duration * 2, 10));
    } catch (error) {
      console.error('Error fetching destinations by interests:', error);
      return [];
    }
  },

  // Get activities based on interests
  getActivitiesByInterest(interests) {
    const activities = {
      'cultural': ['Temple visits', 'Palace tours', 'Historical site exploration', 'Local craft workshops'],
      'beach': ['Beach relaxation', 'Water sports', 'Snorkeling', 'Sunset viewing'],
      'adventure': ['Trekking', 'Wildlife spotting', 'Rock climbing', 'Safari tours'],
      'nature': ['Bird watching', 'Nature walks', 'Photography', 'Waterfall visits'],
      'mixed': ['Sightseeing', 'Local experiences', 'Cultural activities', 'Relaxation']
    };

    return activities[interests.toLowerCase()] || activities['mixed'];
  },

  // Build day-by-day itinerary
  buildItinerary(destinations, duration, interests) {
    const itinerary = [];
    const destPerDay = Math.max(1, Math.ceil(destinations.length / duration));
    
    for (let day = 1; day <= duration; day++) {
      const startIdx = (day - 1) * destPerDay;
      const endIdx = Math.min(startIdx + destPerDay, destinations.length);
      const dayDestinations = destinations.slice(startIdx, endIdx);
      
      itinerary.push({
        day,
        destinations: dayDestinations,
        activities: this.getActivitiesByInterest(interests)
      });
    }
    
    return itinerary;
  },

  // Format the complete itinerary response
  formatItinerary(itinerary, tripData) {
    // Store itinerary in tripData for later reference
    tripData.generatedItinerary = itinerary;
    
    let response = `🎯 **Your Personalized Karnataka Itinerary** 🎯\n\n`;
    response += `📋 **Trip Overview:**\n`;
    response += `• Duration: ${tripData.duration} days\n`;
    response += `• Group Size: ${tripData.groupSize} people\n`;
    response += `• Interests: ${tripData.interests}\n`;
    response += `• Budget Range: ${tripData.budget}\n`;
    response += `• Travel Period: ${tripData.travelDates}\n\n`;

    response += `🗓️ **Day-by-Day Itinerary:**\n\n`;
    
    itinerary.forEach(day => {
      response += `**Day ${day.day}:**\n`;
      if (day.destinations.length > 0) {
        day.destinations.forEach(dest => {
          response += `📍 **${dest.dTitle}** (${dest.dDistrict}, ${dest.dProvince})\n`;
          response += `   ${dest.dDescription.substring(0, 120)}...\n`;
        });
      } else {
        response += `📍 Explore local attractions and relax\n`;
      }
      response += `🎯 Suggested Activities: ${day.activities.slice(0, 3).join(', ')}\n\n`;
    });

    response += `✨ **Next Steps:**\n`;
    response += `• Browse tour packages: http://localhost:5173/tour-packages\n`;
    response += `• Check equipment rentals: http://localhost:5173/userequipment\n`;
    response += `• Need assistance? Contact us: http://localhost:5173/tickets\n`;
    response += `• Read travel tips: http://localhost:5173/user-blog\n\n`;
    response += `💡 **Want to make changes?**\n`;
    response += `• Say "change day X" to modify specific days\n`;
    response += `• Ask "add more cultural sites" for more destinations\n`;
    response += `• Request "make it cheaper" for budget adjustments\n`;
    response += `• Say "help me book" when ready to proceed\n\n`;
    response += `Would you like me to modify any part of this itinerary or help you with booking?`;

    return response;
  },

  // Generate itinerary based on collected data
  async generateItinerary(tripData) {
    const { duration, interests, groupSize, budget, travelDates } = tripData;
    
    try {
      // Get relevant destinations based on interests
      const destinations = await this.getDestinationsByInterests(interests, duration);
      
      // Generate day-by-day itinerary
      const itinerary = this.buildItinerary(destinations, duration, interests);
      
      return this.formatItinerary(itinerary, tripData);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      return "I encountered an issue while creating your itinerary. Let me connect you with our travel experts who can help you personally.\n\nPlease visit: http://localhost:5173/tickets";
    }
  },

  // NEW: Show current trip overview
  showTripOverview(tripData) {
    if (!tripData || Object.keys(tripData).length === 0) {
      return "No trip data available. Please start planning your trip first by saying 'plan a trip'.";
    }

    let response = `📋 **Your Current Trip Overview** 📋\n\n`;
    response += `🎯 **Trip Details:**\n`;
    response += `• Duration: ${tripData.duration || 'Not set'} days\n`;
    response += `• Interests: ${tripData.interests || 'Not set'}\n`;
    response += `• Group Size: ${tripData.groupSize || 'Not set'} people\n`;
    response += `• Budget: ${tripData.budget || 'Not set'}\n`;
    response += `• Travel Dates: ${tripData.travelDates || 'Not set'}\n\n`;

    if (tripData.generatedItinerary) {
      response += `🗓️ **Current Itinerary:**\n\n`;
      tripData.generatedItinerary.forEach(day => {
        response += `**Day ${day.day}:**\n`;
        if (day.destinations && day.destinations.length > 0) {
          day.destinations.forEach(dest => {
            response += `📍 ${dest.dTitle} (${dest.dDistrict})\n`;
          });
        } else {
          response += `📍 Explore local attractions\n`;
        }
        response += `🎯 Activities: ${day.activities.slice(0, 2).join(', ')}\n\n`;
      });
    }

    response += `💡 **Available Actions:**\n`;
    response += `• Say "change day X" to modify specific days\n`;
    response += `• Say "help me book" to find packages\n`;
    response += `• Ask for modifications or proceed with booking\n`;

    return response;
  },

  // ENHANCED: Handle itinerary modifications with specific follow-ups
  async handleItineraryModification(message, tripData, context) {
    const text = message.trim().toLowerCase();
    
    // Handle specific day modifications
    if (text.includes('day') && text.match(/\d+/)) {
      const dayMatch = text.match(/day\s*(\d+)/);
      if (dayMatch) {
        const dayNumber = parseInt(dayMatch[1]);
        context.modifyingDay = dayNumber;
        context.lastIntent = 'modifySpecificDay';
        context.modificationStep = 'selectType';
        
        return `I can help you modify Day ${dayNumber} of your Karnataka itinerary! 📝

**Current Day ${dayNumber} Plan:**
${this.getCurrentDayPlan(dayNumber, tripData)}

What would you like to change?
• Replace destinations with different ones
• Add more cultural sites
• Include adventure activities
• Adjust timing or pace
• Add specific locations you want to visit

Please tell me what modifications you'd like for Day ${dayNumber}.`;
      }
    }

    // Handle follow-up modifications for specific day
    if (context.lastIntent === 'modifySpecificDay' && context.modifyingDay) {
      return await this.handleSpecificDayModification(message, context.modifyingDay, tripData, context);
    }

    // Handle general modifications
    if (text.includes('add') || text.includes('include') || text.includes('more')) {
      context.lastIntent = 'addToItinerary';
      return `I can add more to your itinerary! ✨

What would you like to add?
• More cultural sites (temples, palaces, heritage)
• Adventure activities (trekking, wildlife)
• Beach destinations (if near coastal areas)
• Specific cities or attractions
• Extra days to the trip

Please specify what you'd like to add and I'll update your itinerary accordingly.`;
    }

    if (text.includes('remove') || text.includes('skip') || text.includes('delete')) {
      context.lastIntent = 'removeFromItinerary';
      return `I can remove or replace parts of your itinerary! ✂️

What would you like to remove or skip?
• Specific destinations
• Certain activities
• Entire days
• Types of experiences

Tell me what you'd like to remove and I'll suggest alternatives.`;
    }

    if (text.includes('budget') || text.includes('cheaper') || text.includes('expensive') || text.includes('cost')) {
      context.lastIntent = 'adjustBudget';
      return `I can adjust your itinerary based on budget preferences! 💰

Current budget range: ${tripData.budget}

Would you like to:
• Make it more budget-friendly (Economy options)
• Upgrade to premium experiences
• Focus on free/low-cost attractions
• Find mid-range alternatives

Let me know your budget preference and I'll modify accordingly.`;
    }

    return `I can help modify your Karnataka itinerary! 🔄

Popular modification options:
• **Change specific days** (e.g., "modify day 2")
• **Add destinations** (e.g., "add more temples")
• **Adjust activities** (e.g., "more adventure activities")
• **Budget changes** (e.g., "make it cheaper")
• **Duration changes** (e.g., "add one more day")

What would you like to modify?`;
  },

  // COMPLETELY REWRITTEN: Handle specific day modifications with proper context management
  async handleSpecificDayModification(message, dayNumber, tripData, context) {
    const text = message.trim().toLowerCase();

    console.log(`Handling Day ${dayNumber} modification:`, {
      step: context.modificationStep,
      message: text,
      lastIntent: context.lastIntent
    });

    // Step 1: Handle modification type selection
    if (context.modificationStep === 'selectType') {
      if (text.includes('replace destinations') || text.includes('replace')) {
        context.modificationStep = 'replacingDestinations';
        return `Perfect! Let me suggest different destinations for Day ${dayNumber}! 🔄

**Replacement Options for Day ${dayNumber}:**
• **Beach and coastal areas** - Gokarna, Karwar, Udupi beaches
• **Mountain and hill stations** - Coorg, Chikmagalur, Sakleshpur
• **Urban city experiences** - Bangalore, Mysore city tours
• **Adventure spots** - Trekking, wildlife parks, outdoor activities

Which type would you prefer for Day ${dayNumber}?`;
      }

      if (text.includes('add more cultural') || text.includes('cultural')) {
        context.modificationStep = 'addingCultural';
        return `Excellent! I'll add more cultural experiences to Day ${dayNumber}! 🏛️

**Cultural Sites I can add:**
• **Hampi Heritage Complex** - UNESCO World Heritage site
• **Mysore Palace** - Royal palace and gardens
• **Belur-Halebidu** - Ancient Hoysala temples
• **Srirangapatna** - Historical island fortress
• **Local temples and monuments**

Would you like me to add these cultural sites to Day ${dayNumber}?`;
      }

      if (text.includes('adventure activities') || text.includes('adventure')) {
        context.modificationStep = 'addingAdventure';
        return `Great choice! Adding adventure activities to Day ${dayNumber}! 🏔️

**Adventure Activities Available:**
• **Trekking** - Western Ghats trails, hill forts
• **Wildlife Safaris** - Bandipur, Nagarhole parks
• **Water Sports** - River rafting, kayaking
• **Rock Climbing** - Natural rock formations
• **Nature Photography** - Scenic spots and wildlife

Should I include these adventure activities in Day ${dayNumber}?`;
      }

      if (text.includes('specific locations') || text.includes('specific')) {
        context.modificationStep = 'addingSpecific';
        return `I'd love to add specific locations to Day ${dayNumber}! 📍

**Popular Karnataka Locations:**
• **Historical**: Hampi, Badami, Aihole
• **Spiritual**: Dharmasthala, Udupi, Sringeri
• **Nature**: Jog Falls, Abbey Falls, Kudremukh
• **Adventure**: Coorg hills, Chikmagalur peaks
• **Coastal**: Gokarna, Karwar, Murdeshwar

Which specific locations would you like me to add to Day ${dayNumber}?`;
      }

      if (text.includes('timing') || text.includes('pace')) {
        context.modificationStep = 'adjustingPace';
        return `I can adjust the timing and pace for Day ${dayNumber}! ⏰

**Pace Options:**
• **Relaxed pace** - Fewer destinations, more time at each
• **Moderate pace** - Balanced itinerary with breaks
• **Fast-paced** - More destinations, active schedule
• **Custom timing** - Specific start/end times

What pace would you prefer for Day ${dayNumber}?`;
      }

      // Handle ambiguous responses in selection phase
      if (text.includes('good') || text.includes('ok') || text.includes('proceed')) {
        return `Please choose what you'd like to change for Day ${dayNumber}:

• **Replace destinations** with different ones
• **Add more cultural sites** 
• **Include adventure activities**
• **Adjust timing or pace**
• **Add specific locations**

Just tell me which option interests you!`;
      }

      // Fallback for unclear selection
      return `Please select what you'd like to modify for Day ${dayNumber}:

📍 **Replace destinations** - Change to different type of places
🏛️ **Add cultural sites** - Include temples, palaces, heritage
🏔️ **Adventure activities** - Add trekking, wildlife, sports
⏰ **Adjust timing/pace** - Change schedule or speed
🎯 **Specific locations** - Add particular places you want

What would you like to do?`;
    }

    // Step 2: Handle specific modifications based on type
    if (context.modificationStep === 'replacingDestinations') {
      let newDestinations = [];
      let destinationType = '';

      if (text.includes('beach') || text.includes('coastal')) {
        destinationType = 'Beach and Coastal';
        newDestinations = [
          { name: 'Gokarna Beach', location: 'Uttara Kannada', activity: 'Beach relaxation and temple visits' },
          { name: 'Karwar Beach', location: 'Uttara Kannada', activity: 'Water sports and sunset views' }
        ];
      } else if (text.includes('mountain') || text.includes('hill')) {
        destinationType = 'Mountain and Hills';
        newDestinations = [
          { name: 'Coorg Hill Station', location: 'Kodagu', activity: 'Coffee plantation tours' },
          { name: 'Chikmagalur Hills', location: 'Chikmagalur', activity: 'Trekking and nature walks' }
        ];
      } else if (text.includes('urban') || text.includes('city')) {
        destinationType = 'Urban Experiences';
        newDestinations = [
          { name: 'Bangalore City Tour', location: 'Bangalore', activity: 'Modern attractions and shopping' },
          { name: 'Mysore City', location: 'Mysore', activity: 'Palace tours and local markets' }
        ];
      } else if (text.includes('adventure')) {
        destinationType = 'Adventure Spots';
        newDestinations = [
          { name: 'Kudremukh Trek', location: 'Chikmagalur', activity: 'Mountain trekking' },
          { name: 'Bandipur Safari', location: 'Chamarajanagar', activity: 'Wildlife spotting' }
        ];
      }

      if (newDestinations.length > 0) {
        // Reset context and update itinerary
        context.lastIntent = 'tripComplete';
        context.modifyingDay = null;
        context.modificationStep = null;

        return `Perfect! Day ${dayNumber} has been updated with ${destinationType} experiences! 🎯

**Updated Day ${dayNumber} Plan:**
${newDestinations.map(dest => 
  `📍 **${dest.name}** (${dest.location})\n   ${dest.activity}`
).join('\n')}

🎯 **Your Day ${dayNumber} now includes:**
${newDestinations.map(dest => `• ${dest.activity}`).join('\n')}

**Next Options:**
• Modify other days if needed
• View complete updated itinerary
• Proceed with booking

Would you like to make other changes or proceed with booking?`;
      }

      // If unclear destination type, ask for clarification
      return `Please choose the type of destinations for Day ${dayNumber}:

🏖️ **Beach and coastal areas** - Gokarna, Karwar beaches
🏔️ **Mountain and hill stations** - Coorg, Chikmagalur hills  
🏙️ **Urban city experiences** - Bangalore, Mysore cities
🎯 **Adventure spots** - Trekking, wildlife parks

Which type would you prefer?`;
    }

    if (context.modificationStep === 'addingCultural') {
      if (text.includes('yes') || text.includes('add') || text.includes('include')) {
        context.lastIntent = 'tripComplete';
        context.modifyingDay = null;
        context.modificationStep = null;

        return `Excellent! Day ${dayNumber} now has enhanced cultural experiences! 🏛️

**Updated Day ${dayNumber} - Cultural Focus:**
📍 **Hampi Heritage Complex**
   UNESCO World Heritage site with ancient temples
📍 **Mysore Palace** 
   Royal palace with Indo-Saracenic architecture
📍 **Local Temple Circuit**
   Traditional Karnataka temple architecture

🎯 **Cultural Activities Added:**
• Ancient temple exploration
• Heritage site guided tours  
• Local artisan workshops
• Traditional architecture study

**Next Steps:**
• Make other modifications if needed
• View your complete updated itinerary
• Find matching cultural tour packages

Would you like to modify other days or proceed with booking?`;
      }

      return `Would you like me to add these cultural sites to Day ${dayNumber}?

🏛️ **Hampi Heritage Complex** - Ancient Vijayanagara capital
🏰 **Mysore Palace** - Royal architecture and gardens
⛩️ **Temple Circuit** - Traditional Karnataka temples
🎨 **Artisan Workshops** - Local craft experiences

Say **"yes"** to add these or tell me what specific cultural sites you prefer!`;
    }

    if (context.modificationStep === 'addingAdventure') {
      if (text.includes('yes') || text.includes('include') || text.includes('add')) {
        context.lastIntent = 'tripComplete';
        context.modifyingDay = null;
        context.modificationStep = null;

        return `Awesome! Day ${dayNumber} is now packed with adventure! 🏔️

**Updated Day ${dayNumber} - Adventure Focus:**
📍 **Morning: Trekking Expedition**
   Western Ghats trails with scenic viewpoints
📍 **Afternoon: Wildlife Safari**
   Bandipur/Nagarhole wildlife spotting
📍 **Evening: Adventure Sports**
   Rock climbing or river activities

🎯 **Adventure Activities Added:**
• Guided trekking with nature experts
• Wildlife safari in national parks
• Rock climbing at natural formations
• Adventure photography opportunities

**Equipment Recommendations:**
• Trekking shoes and gear
• Wildlife viewing equipment
• Safety equipment for sports

🎒 **Rent equipment:** http://localhost:5173/userequipment

Ready for more changes or shall we proceed with booking this adventure-packed itinerary?`;
      }

      return `Should I add these adventure activities to Day ${dayNumber}?

🥾 **Trekking** - Western Ghats trails and hill forts
🦌 **Wildlife Safari** - National park animal spotting
🧗 **Rock Climbing** - Natural rock formations
📸 **Adventure Photography** - Scenic and wildlife shots

Say **"yes"** to include these or specify which adventure activities you prefer!`;
    }

    if (context.modificationStep === 'addingSpecific') {
      // Handle specific location requests
      const specificLocations = text.match(/\b(hampi|mysore|coorg|gokarna|chikmagalur|bangalore|udupi|badami|dharmasthala|jog falls|kudremukh)\b/gi);
      
      if (specificLocations && specificLocations.length > 0) {
        context.lastIntent = 'tripComplete';
        context.modifyingDay = null;
        context.modificationStep = null;

        const locations = specificLocations.map(loc => loc.charAt(0).toUpperCase() + loc.slice(1).toLowerCase());
        
        return `Perfect! Day ${dayNumber} now includes your specific locations! 📍

**Updated Day ${dayNumber} Plan:**
${locations.map((loc, index) => `📍 **${loc}**\n   ${this.getLocationDescription(loc)}`).join('\n')}

🎯 **Your requested locations added:**
${locations.map(loc => `• ${loc} - ${this.getLocationActivity(loc)}`).join('\n')}

**Travel Tips:**
• Plan transportation between locations
• Check opening hours for attractions
• Consider local accommodation if needed

Would you like to modify other days or proceed with this customized itinerary?`;
      }

      return `Please tell me which specific locations you'd like for Day ${dayNumber}:

**Popular Choices:**
• **Hampi** - Ancient ruins and temples
• **Mysore** - Palace and gardens
• **Coorg** - Coffee plantations and hills
• **Gokarna** - Beaches and temples
• **Chikmagalur** - Hill station and trekking

Just mention the locations you want to visit!`;
    }

    if (context.modificationStep === 'adjustingPace') {
      let paceDescription = '';

      if (text.includes('relaxed') || text.includes('slow')) {
        paceDescription = 'Relaxed Pace - More time at fewer places';
      } else if (text.includes('moderate') || text.includes('balanced')) {
        paceDescription = 'Moderate Pace - Balanced schedule with breaks';
      } else if (text.includes('fast') || text.includes('active')) {
        paceDescription = 'Fast-Paced - More destinations, active schedule';
      }

      if (paceDescription) {
        context.lastIntent = 'tripComplete';
        context.modifyingDay = null;
        context.modificationStep = null;

        return `Great! Day ${dayNumber} timing has been adjusted! ⏰

**Updated Day ${dayNumber} Schedule:**
📅 **Pace**: ${paceDescription}

⏰ **Timing Adjustments:**
• **Morning**: 9:00 AM start (relaxed pace)
• **Lunch Break**: Extended time for local cuisine
• **Afternoon**: Flexible timing between activities
• **Evening**: Earlier finish for rest

🎯 **Schedule Benefits:**
• More enjoyable experience
• Time for spontaneous discoveries
• Less rushed between locations
• Better photo opportunities

Ready to modify other days or proceed with booking?`;
      }

      return `What pace would you prefer for Day ${dayNumber}?

⏰ **Relaxed** - Fewer places, more time at each location
⚖️ **Moderate** - Balanced itinerary with sufficient breaks
⚡ **Fast-paced** - More destinations, active schedule
🎯 **Custom** - Tell me your specific timing preferences

Which pace suits your travel style?`;
    }

    // Fallback for unclear responses during modification
    return `I'm still working on modifying Day ${dayNumber}. 

Current modification: ${context.modificationStep}

Please provide a clear response about what you'd like to change, or say **"start over"** to choose a different modification type.`;
  },

  // Helper function to get current day plan
  getCurrentDayPlan(dayNumber, tripData) {
    if (tripData.generatedItinerary && tripData.generatedItinerary[dayNumber - 1]) {
      const day = tripData.generatedItinerary[dayNumber - 1];
      if (day.destinations && day.destinations.length > 0) {
        return day.destinations.map(dest => 
          `📍 ${dest.dTitle} (${dest.dDistrict})`
        ).join('\n');
      }
    }
    
    return `Day ${dayNumber}: Explore ${tripData.interests} attractions and local experiences
Activities: Based on your ${tripData.interests} preferences
Budget: ${tripData.budget} range accommodations and activities`;
  },

  // Helper functions for specific locations
  getLocationDescription(location) {
    const descriptions = {
      'Hampi': 'Ancient capital with stunning ruins and temples',
      'Mysore': 'Royal city with magnificent palace and gardens',
      'Coorg': 'Coffee country with lush hills and plantations',
      'Gokarna': 'Sacred town with beautiful beaches',
      'Chikmagalur': 'Hill station perfect for trekking and nature',
      'Bangalore': 'Modern city with gardens and tech attractions',
      'Udupi': 'Temple town famous for cuisine and beaches',
      'Badami': 'Ancient rock-cut cave temples',
      'Dharmasthala': 'Pilgrimage center with spiritual significance'
    };
    return descriptions[location] || 'Unique Karnataka destination with local attractions';
  },

  getLocationActivity(location) {
    const activities = {
      'Hampi': 'Heritage exploration and temple visits',
      'Mysore': 'Palace tours and cultural experiences',
      'Coorg': 'Coffee plantation tours and hill walks',
      'Gokarna': 'Beach activities and temple visits',
      'Chikmagalur': 'Trekking and nature photography',
      'Bangalore': 'City tours and modern attractions',
      'Udupi': 'Temple visits and coastal experiences',
      'Badami': 'Cave temple exploration',
      'Dharmasthala': 'Spiritual and cultural activities'
    };
    return activities[location] || 'Local sightseeing and cultural activities';
  },

  // Updated: Find actual packages from your TourPackage database
  async findMatchingPackages(tripData) {
    const { duration, interests, budget, groupSize } = tripData;
    
    try {
      // Map user interests to your database categories
      const categoryMap = {
        'cultural': 'Cultural Tours',
        'adventure': 'Adventure Tours', 
        'nature': 'Wildlife and Nature Tours',
        'beach': 'Adventure Tours',
        'mixed': null
      };

      const dbCategory = categoryMap[interests.toLowerCase()];
      
      // Build query based on trip requirements
      let query = {
        pDays: duration
      };

      if (dbCategory) {
        query.pCategory = dbCategory;
      }

      // Budget range mapping
      let priceQuery = {};
      switch (budget.toLowerCase()) {
        case 'economy':
          priceQuery = { packagePrice: { $lte: 25000 } };
          break;
        case 'standard':
          priceQuery = { packagePrice: { $gte: 25000, $lte: 40000 } };
          break;
        case 'premium':
          priceQuery = { packagePrice: { $gte: 40000, $lte: 60000 } };
          break;
        case 'luxury':
          priceQuery = { packagePrice: { $gte: 60000 } };
          break;
      }

      const finalQuery = { ...query, ...priceQuery };
      console.log('Searching packages with query:', finalQuery);

      const packages = await TourPackage.find(finalQuery)
        .select('packageId package_Title packageDes pCategory packagePrice pDestination pDays pImage')
        .sort({ packagePrice: 1 })
        .limit(5);

      console.log(`Found ${packages.length} matching packages`);

      if (packages.length === 0) {
        const fallbackQuery = dbCategory ? { pCategory: dbCategory } : {};
        const fallbackPackages = await TourPackage.find(fallbackQuery)
          .select('packageId package_Title packageDes pCategory packagePrice pDestination pDays')
          .sort({ packagePrice: 1 })
          .limit(3);

        if (fallbackPackages.length === 0) {
          return `No packages found matching your exact requirements. 😔

**Your Requirements:**
• ${duration} days, ${interests} focus
• ${groupSize} ${groupSize === 1 ? 'person' : 'people'}, ${budget} budget

**Suggestions:**
• Browse all packages: http://localhost:5173/tour-packages
• Contact us for custom packages: http://localhost:5173/tickets
• Try different duration or budget range

Would you like me to search with different criteria?`;
        }

        let reply = `🔍 **Found ${fallbackPackages.length} Similar Packages** (broader search)\n\n`;
        reply += `Your exact requirements (${duration} days, ${budget}) had limited matches, so here are similar options:\n\n`;
        
        fallbackPackages.forEach((pkg, index) => {
          reply += `**${index + 1}. ${pkg.package_Title}**\n`;
          reply += `💰 Price: ₹${pkg.packagePrice.toLocaleString()} per person\n`;
          reply += `📅 Duration: ${pkg.pDays} days\n`;
          reply += `🏷️ Category: ${pkg.pCategory}\n`;
          reply += `📍 Destination: ${pkg.pDestination}\n`;
          reply += `📝 ${pkg.packageDes.substring(0, 120)}...\n\n`;
        });

        reply += `🎯 **Options:**\n`;
        reply += `• View all packages: http://localhost:5173/tour-packages\n`;
        reply += `• Get custom quote: http://localhost:5173/tickets\n`;
        reply += `• Modify your requirements\n\n`;
        reply += `Would you like to adjust your preferences or proceed with one of these packages?`;

        return reply;
      }

      let reply = `🎯 **Perfect Packages Found in Our Database!** 🎯\n\n`;
      reply += `✅ **Matching Your Requirements:**\n`;
      reply += `• ${duration} days, ${interests} focus\n`;
      reply += `• ${groupSize} ${groupSize === 1 ? 'person' : 'people'}, ${budget} budget\n`;
      reply += `• ${packages.length} packages available\n\n`;
      
      packages.forEach((pkg, index) => {
        reply += `**${index + 1}. ${pkg.package_Title}**\n`;
        reply += `🆔 Package ID: ${pkg.packageId}\n`;
        reply += `💰 Price: ₹${pkg.packagePrice.toLocaleString()} per person\n`;
        reply += `📅 Duration: ${pkg.pDays} days\n`;
        reply += `🏷️ Category: ${pkg.pCategory}\n`;
        reply += `📍 Destinations: ${pkg.pDestination}\n`;
        reply += `📝 Description: ${pkg.packageDes.substring(0, 150)}...\n\n`;
      });

      reply += `🚀 **Ready to Book?**\n`;
      reply += `• Browse full details: http://localhost:5173/tour-packages\n`;
      reply += `• Book directly with Package ID\n`;
      reply += `• Get personalized assistance: http://localhost:5173/tickets\n`;
      reply += `• Need equipment? http://localhost:5173/userequipment\n\n`;
      reply += `Would you like more details about any specific package or shall we proceed with booking?`;

      return reply;

    } catch (error) {
      console.error('Error finding packages from database:', error);
      return `I encountered an issue while searching our package database. 😔

**Alternative Options:**
• Browse all packages: http://localhost:5173/tour-packages
• Contact our travel experts: http://localhost:5173/tickets
• Try searching again

Our team can help you find the perfect package manually. What would you prefer?`;
    }
  },

  // Get all tour packages (for general package queries)
  async getTourPackages(limit = 6) {
    try {
      const packages = await TourPackage.find()
        .select('packageId package_Title packageDes pCategory packagePrice pDestination pDays')
        .sort({ packagePrice: 1 })
        .limit(limit);

      if (packages.length === 0) {
        return "No tour packages available at the moment. Please visit http://localhost:5173/tour-packages for updates.";
      }

      let reply = `🎒 **Available Tour Packages:**\n\n`;
      
      packages.forEach((pkg, index) => {
        reply += `**${index + 1}. ${pkg.package_Title}**\n`;
        reply += `💰 ₹${pkg.packagePrice.toLocaleString()} | 📅 ${pkg.pDays} days | 🏷️ ${pkg.pCategory}\n`;
        reply += `📍 ${pkg.pDestination}\n`;
        reply += `📝 ${pkg.packageDes.substring(0, 100)}...\n\n`;
      });

      reply += `🌟 **Book Your Adventure:**\n`;
      reply += `• View full details: http://localhost:5173/tour-packages\n`;
      reply += `• Get assistance: http://localhost:5173/tickets\n\n`;
      reply += `Would you like more information about any specific package?`;

      return reply;
    } catch (error) {
      console.error('Error fetching tour packages:', error);
      return "Visit our packages page: http://localhost:5173/tour-packages";
    }
  }
};

// Static reply function for fallback
function getStaticReply(text) {
  for (const key of Object.keys(replyTable)) {
    if (key === 'fallback') continue;
    const { triggers, reply } = replyTable[key];
    if (triggers && triggers.some(t => text.includes(t))) {
      return reply;
    }
  }
  return replyTable.fallback.reply;
}

// Trip planning conversation flow handler
async function handleTripPlanningFlow(message, userId, context) {
  const text = message.trim().toLowerCase();
  
  if (!context.tripData) {
    context.tripData = {};
  }

  console.log('Trip planning step:', context.tripPlanningStep, 'Message:', text);

  switch (context.tripPlanningStep) {
    case 'start':
    case 'duration':
      const durationMatch = text.match(/(\d+)/);
      if (durationMatch) {
        const days = parseInt(durationMatch[1]);
        if (days >= 1 && days <= 30) {
          context.tripData.duration = days;
          context.tripPlanningStep = 'interests';
          return `Great! ${days} days is perfect for exploring Karnataka. 🌟

Now, what type of experience interests you most?

🏛️ **Cultural** - Temples, palaces, heritage sites, historical places
🏖️ **Beach** - Coastal areas, water activities, relaxation  
🏔️ **Adventure** - Trekking, wildlife safaris, Western Ghats adventures
🌿 **Nature** - National parks, waterfalls, scenic landscapes
🎭 **Mixed** - A combination of everything

Just type your preference (e.g., "cultural" or "mixed")`;
        } else {
          return "Please enter a realistic duration between 1-30 days for your Karnataka trip.";
        }
      } else {
        return "Please enter the number of days you'd like to spend in Karnataka (e.g., '7 days' or just '7')";
      }

    case 'interests':
      const interests = ['cultural', 'beach', 'adventure', 'nature', 'mixed'];
      const userInterest = interests.find(interest => text.includes(interest));
      
      if (userInterest) {
        context.tripData.interests = userInterest;
        context.tripPlanningStep = 'groupSize';
        return `Excellent choice! ${userInterest.charAt(0).toUpperCase() + userInterest.slice(1)} experiences are amazing in Karnataka. 🎯

How many people will be traveling? 

👤 Solo (1 person)
👫 Couple (2 people)  
👨‍👩‍👧‍👦 Family (3-6 people)
👥 Group (7+ people)

Please tell me the number of travelers.`;
      } else {
        return "Please choose from: **Cultural**, **Beach**, **Adventure**, **Nature**, or **Mixed**";
      }

    case 'groupSize':
      const sizeMatch = text.match(/(\d+)/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1]);
        if (size >= 1 && size <= 50) {
          context.tripData.groupSize = size;
          context.tripPlanningStep = 'budget';
          return `Perfect! Planning for ${size} ${size === 1 ? 'person' : 'people'}. 👥

What's your approximate budget range per person?

💰 **Budget Options:**
🏷️ **Economy** (₹15,000 - ₹25,000)
🏷️ **Standard** (₹25,000 - ₹40,000)  
🏷️ **Premium** (₹40,000 - ₹60,000)
🏷️ **Luxury** (₹60,000+)

Please specify your budget range or enter a specific amount.`;
        } else {
          return "Please enter a reasonable group size (1-50 people).";
        }
      } else {
        return "Please enter the number of people traveling (e.g., '2 people' or just '2')";
      }

    case 'budget':
      let budget = 'Standard';
      if (text.includes('economy') || text.includes('budget')) budget = 'Economy';
      else if (text.includes('premium')) budget = 'Premium';
      else if (text.includes('luxury')) budget = 'Luxury';
      else if (text.includes('standard')) budget = 'Standard';
      
      const budgetMatch = text.match(/₹?(\d{1,2}),?(\d{3})/);
      if (budgetMatch) {
        const amount = parseInt(budgetMatch[1] + budgetMatch[2]);
        if (amount < 25000) budget = 'Economy';
        else if (amount < 40000) budget = 'Standard';
        else if (amount < 60000) budget = 'Premium';
        else budget = 'Luxury';
      }
      
      context.tripData.budget = budget;
      context.tripPlanningStep = 'dates';
      return `Great! I've noted your ${budget} budget range. 💰

Finally, when are you planning to visit Karnataka?

🌤️ **Best Time to Visit:**
• **October - March**: Pleasant weather, perfect for all activities ☀️
• **April - June**: Summer season, good for hill stations 🏔️
• **July - September**: Monsoon season, great for waterfalls 🌧️
• **December - February**: Peak tourist season, ideal weather ❄️

Please provide your preferred travel dates or month.`;

    case 'dates':
      context.tripData.travelDates = message;
      context.tripPlanningStep = 'complete';
      context.lastIntent = 'tripComplete';
      
      return await dbQueries.generateItinerary(context.tripData);

    default:
      return "Let's start planning your trip! How many days would you like to spend in Karnataka?";
  }
}

// Enhanced reply function with database integration
async function getReplyWithData(message = '', userId = null, context = {}) {
  const text = message.trim().toLowerCase();

  // Check for user bookings FIRST before trip booking
  if (text === 'my booking' || text === 'my bookings' || text === 'show my bookings') {
    console.log('User requesting their bookings');
    const dbReply = await dbQueries.userBookings(userId);
    if (dbReply) return dbReply;
  }

  // NEW: Handle trip overview requests
  if (text.includes('trip overview') || text.includes('show me') && text.includes('trip') || 
      text.includes('current itinerary') || text === 'overview') {
    return dbQueries.showTripOverview(context.tripData);
  }

  // Tour package queries
  if (text.includes('package') || text.includes('tour package') || text.includes('packages')) {
    if (!text.includes('help me book') && !text.includes('find specific')) {
      const dbReply = await dbQueries.getTourPackages();
      if (dbReply) return dbReply;
    }
  }

  // Trip planning queries
  if (text.includes('plan') && (text.includes('trip') || text.includes('tour') || text.includes('itinerary'))) {
    context.lastIntent = 'tripPlanning';
    context.tripPlanningStep = 'start';
    return await dbQueries.initiateTripPlanning(userId, context);
  }

  // Blog queries
  if (text.includes('blog') || text.includes('article') || text.includes('tips')) {
    if (text.includes('search') || text.includes('find')) {
      const searchQuery = text.replace(/blog|article|tips|search|find|for/gi, '').trim();
      if (searchQuery.length > 2) {
        const dbReply = await dbQueries.searchBlogs(searchQuery);
        if (dbReply) return dbReply;
      }
    }
    const dbReply = await dbQueries.blogPosts();
    if (dbReply) return dbReply;
  }

  // Equipment queries
  if (text.includes('equipment') || text.includes('gear') || text.includes('rent')) {
    let equipmentType = null;
    
    if (text.includes('hiking')) equipmentType = 'Hiking';
    else if (text.includes('luggage')) equipmentType = 'Luggage';
    else if (text.includes('clothes') || text.includes('clothing')) equipmentType = 'Clothes';
    else if (text.includes('toiletries')) equipmentType = 'Toiletries';
    
    const dbReply = await dbQueries.equipment(equipmentType);
    if (dbReply) return dbReply;
  }

  // Destination queries
  if (text.includes('destination') || text.includes('places') || text.includes('visit')) {
    if (text.includes('popular') || text.includes('district')) {
      const dbReply = await dbQueries.popularDistricts();
      if (dbReply) return dbReply;
    }
    
    const locationTerms = text.match(/\b(bangalore|bengaluru|mysore|hampi|gokarna|coorg|kodagu|karwar|udupi|mangalore|hassan|chikmagalur|badami|bijapur|hubli|dharwad|belgaum|davangere|shimoga|tumkur)\b/i);
    if (locationTerms) {
      const dbReply = await dbQueries.searchDestinations(locationTerms[0]);
      if (dbReply) return dbReply;
    }
    
    const dbReply = await dbQueries.destinations();
    if (dbReply) return dbReply;
  }

  // General search functionality
  if (text.includes('search') || text.includes('find')) {
    const searchQuery = text.replace(/search|find|for/gi, '').trim();
    if (searchQuery.length > 2) {
      const destReply = await dbQueries.searchDestinations(searchQuery);
      if (destReply) return destReply;
      
      const blogReply = await dbQueries.searchBlogs(searchQuery);
      if (blogReply) return blogReply;
    }
  }

  // Support queries
  if (text.includes('support') || text.includes('help') || text.includes('contact')) {
    return "💬 Need assistance? You can:\n• Visit our support page: http://localhost:5173/tickets\n• Browse our blog for tips: http://localhost:5173/user-blog\n• Check our equipment page: http://localhost:5173/userequipment\n• Explore destinations: http://localhost:5173/destinations\n\nWhat can I help you with?";
  }

  return getStaticReply(text);
}

// COMPLETELY REWRITTEN Context-aware reply function with FIXED CONTEXT MANAGEMENT
async function getContextualReply(message, userId, context) {
  const text = message.trim().toLowerCase();
  
  console.log('=== CONTEXT CHECK ===');
  console.log('Current context:', {
    lastIntent: context.lastIntent,
    tripPlanningStep: context.tripPlanningStep,
    modifyingDay: context.modifyingDay,
    modificationStep: context.modificationStep,
    bookingStep: context.bookingStep,
    message: text.substring(0, 50)
  });
  console.log('======================');
  
  // 1. HIGHEST PRIORITY: Active trip planning flow
  if (context.lastIntent === 'tripPlanning' && context.tripPlanningStep && context.tripPlanningStep !== 'complete') {
    console.log('Entering trip planning flow');
    return await handleTripPlanningFlow(message, userId, context);
  }

  // 2. CRITICAL: Handle specific day modification in progress (FIXED)
  if (context.lastIntent === 'modifySpecificDay' && context.modifyingDay) {
    console.log(`Continuing Day ${context.modifyingDay} modification flow`);
    return await dbQueries.handleSpecificDayModification(message, context.modifyingDay, context.tripData, context);
  }

  // 3. Handle common user responses during modification flow
  if (context.modifyingDay && !context.lastIntent !== 'tripComplete') {
    console.log('Handling modification flow responses');
    
    // Handle "proceed further", "good", "show me trip overview" type responses
    if (text.includes('proceed') || text.includes('further') || text.includes('continue')) {
      return `I'm still helping you modify Day ${context.modifyingDay}. 

What would you like to change for Day ${context.modifyingDay}?
• **Replace destinations** with different ones
• **Add more cultural sites** 
• **Include adventure activities**
• **Adjust timing or pace**
• **Add specific locations**

Please choose one of these options to continue.`;
    }

    if (text.includes('good') || text === 'ok' || text === 'okay') {
      return `Great! Let's continue modifying Day ${context.modifyingDay}.

Please tell me specifically what you'd like to change:
• **Replace destinations** - Change to different type of places
• **Add cultural sites** - Include more temples, heritage sites  
• **Adventure activities** - Add trekking, wildlife, sports
• **Adjust timing** - Change pace or schedule
• **Specific locations** - Add particular places you want

What would you like to do for Day ${context.modifyingDay}?`;
    }

    if (text.includes('show') && (text.includes('trip') || text.includes('overview') || text.includes('itinerary'))) {
      const overview = dbQueries.showTripOverview(context.tripData);
      return overview + `\n\n📝 **Currently modifying Day ${context.modifyingDay}**\n\nWhat changes would you like to make to Day ${context.modifyingDay}?`;
    }

    // If user gives unclear response during modification
    return `I'm currently helping you modify Day ${context.modifyingDay}. 

Please choose what you'd like to change:
• **Replace destinations** with different ones
• **Add more cultural sites** 
• **Include adventure activities**
• **Adjust timing or pace**
• **Add specific locations**

What would you like to modify for Day ${context.modifyingDay}?`;
  }

  // 4. BOOKING FLOW - Handle booking assistance conversation
  if (context.lastIntent === 'bookingAssistance' || context.bookingStep) {
    console.log('Handling booking flow');
    
    // Handle "yes" responses in booking context
    if (text === 'yes' || text === 'yeah' || text === 'sure' || text === 'ok' || text === 'okay') {
      context.bookingStep = 'findPackages';
      return await dbQueries.findMatchingPackages(context.tripData);
    }
    
    // Handle requests for specific packages or more details
    if (text.includes('package') || text.includes('detail') || text.includes('more info') || 
        text.includes('tell me more') || text.includes('specific')) {
      return await dbQueries.findMatchingPackages(context.tripData);
    }
    
    // Handle booking confirmation
    if (text.includes('book') || text.includes('proceed') || text.includes('confirm')) {
      context.lastIntent = 'tripComplete';
      context.bookingStep = null;
      return `Excellent! Let's get your Karnataka adventure booked! 🎉

**Next Steps:**
1. **Online Booking**: Visit http://localhost:5173/tour-packages
2. **Personal Assistance**: Get expert help at http://localhost:5173/tickets  
3. **Call Us**: Speak directly with our travel consultants
4. **Equipment**: Don't forget to check http://localhost:5173/userequipment

**Your Trip Summary:**
• ${context.tripData?.duration || 'N/A'} days in Karnataka
• ${context.tripData?.interests || 'N/A'} focused itinerary
• ${context.tripData?.groupSize || 'N/A'} travelers
• ${context.tripData?.budget || 'N/A'} budget range

Our team will help you complete the booking process. Have a fantastic trip! 🌟`;
    }
  }

  // 5. Check for exact user booking requests (distinguish from trip booking)
  if (text === 'my booking' || text === 'my bookings' || text === 'show my bookings' || 
      text.includes('my reservation') || text.includes('my trip status')) {
    console.log('User wants to see their existing bookings');
    return await dbQueries.userBookings(userId);
  }

  // 6. Handle trip modification and booking requests (after trip is complete)
  if ((context.lastIntent === 'tripComplete' || context.lastIntent === 'modifyItinerary') && 
      context.tripData && Object.keys(context.tripData).length > 0) {
    
    // Check for booking requests
    if (text.includes('book') || text.includes('help me book') || 
        text.includes('find packages') || text.includes('specific packages') ||
        (text.includes('package') && text.includes('match'))) {
      
      console.log('User wants to book their planned trip');
      context.lastIntent = 'bookingAssistance';
      context.bookingStep = 'initial';
      
      return `Perfect! Let me find real packages from our database that match your Karnataka adventure. 🎯

**Your Trip Requirements:**
• Duration: ${context.tripData?.duration || 'N/A'} days
• Interests: ${context.tripData?.interests || 'N/A'}
• Group size: ${context.tripData?.groupSize || 'N/A'} people
• Budget: ${context.tripData?.budget || 'N/A'}

I'll search our actual tour package database for packages that perfectly match your customized itinerary. These are real, bookable packages with confirmed pricing and availability.

Would you like me to show you the matching packages from our database?`;
    }

    // Check for modification requests - IMPROVED DETECTION
    if (text.includes('change') || text.includes('modify') || 
        (text.includes('day') && text.match(/\d+/)) || 
        text.includes('add') || text.includes('remove') || text.includes('different') ||
        text.includes('adventure') || text.includes('cultural') || text.includes('include') ||
        text.includes('replace') || text.includes('adjust')) {
      
      console.log('Handling itinerary modification');
      return await dbQueries.handleItineraryModification(message, context.tripData, context);
    }
  }

  // 7. Handle other modification contexts
  if (context.lastIntent === 'addToItinerary' || context.lastIntent === 'removeFromItinerary' || 
      context.lastIntent === 'adjustBudget') {
    
    // Process the modification request
    context.lastIntent = 'tripComplete';
    return `Great! I've noted your modification request. Your updated itinerary will include those changes.

🎯 **Modification Applied Successfully!**

Your ${context.tripData?.duration || 'N/A'} day Karnataka ${context.tripData?.interests || 'adventure'} trip has been updated based on your preferences.

**Next steps:**
• Review the changes
• Make additional modifications if needed
• Proceed with booking when ready

Would you like to make any other changes or shall we proceed with booking?`;
  }

  // 8. General context handling for other features
  if (context.lastIntent === 'destinations') {
    if (text.includes('book') || text.includes('package') || text.includes('tour')) {
      context.lastIntent = 'booking';
      return "Great! I can help you find tour packages for your chosen destination. 🎯\n\nYou can:\n• Browse all packages: http://localhost:5173/tour-packages\n• Tell me your preferred destination\n• Let me know your budget range\n\nWhat interests you most?";
    }
    
    if (text.includes('equipment') || text.includes('gear')) {
      const dbReply = await dbQueries.equipment();
      if (dbReply) return dbReply;
    }
  }
  
  if (context.lastIntent === 'equipment') {
    if (text.includes('book') || text.includes('rent')) {
      return "To rent equipment, please:\n• Visit our equipment page: http://localhost:5173/userequipment\n• Add items to your booking\n• Complete the rental process\n\nNeed help with anything specific?";
    }
  }
  
  if (context.lastIntent === 'blogs') {
    if (text.includes('more') || text.includes('other')) {
      const dbReply = await dbQueries.blogPosts(8);
      if (dbReply) return dbReply;
    }
  }

  // Update context based on current message
  if (text.includes('destination') || text.includes('places')) {
    context.lastIntent = 'destinations';
  } else if (text.includes('equipment') || text.includes('gear')) {
    context.lastIntent = 'equipment';  
  } else if (text.includes('blog') || text.includes('article')) {
    context.lastIntent = 'blogs';
  } else if (text.includes('booking') || text.includes('book')) {
    context.lastIntent = 'booking';
  }
  
  // Fall back to data-driven replies
  return await getReplyWithData(message, userId, context);
}

// Session cleanup function
function cleanupOldSessions() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  for (const [sessionId, context] of sessions.entries()) {
    const lastActivity = context.conversationHistory[context.conversationHistory.length - 1]?.timestamp;
    if (lastActivity && new Date(lastActivity).getTime() < oneHourAgo) {
      sessions.delete(sessionId);
    }
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupOldSessions, 30 * 60 * 1000);

// Main POST route with enhanced session management
router.post('/', async (req, res) => {
  try {
    let { message, userId, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Use provided sessionId or generate consistent one
    if (!sessionId) {
      sessionId = userId ? `user_${userId}_${Date.now()}` : `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated new sessionId:', sessionId);
    } else {
      console.log('Using existing sessionId:', sessionId);
    }
    
    // Get or create session context
    let context = sessions.get(sessionId) || { 
      lastIntent: null,
      lastMentionedDestination: null,
      selectedPackage: null,
      conversationHistory: [],
      userId: userId,
      createdAt: new Date(),
      tripPlanningStep: null,
      tripData: {},
      // Enhanced context for modifications and booking
      modifyingDay: null,
      modificationStep: null,
      bookingStep: null
    };
    
    // Ensure user ID is consistent
    context.userId = userId;
    
    // Add debugging
    console.log('=== CHAT REQUEST ===');
    console.log('SessionId:', sessionId);
    console.log('Current context before processing:', {
      lastIntent: context.lastIntent,
      tripPlanningStep: context.tripPlanningStep,
      modifyingDay: context.modifyingDay,
      modificationStep: context.modificationStep,
      bookingStep: context.bookingStep,
      hasTripData: !!context.tripData && Object.keys(context.tripData).length > 0
    });
    console.log('Message:', message);
    
    // Add current message to history
    context.conversationHistory.push({ 
      user: message, 
      timestamp: new Date(),
      userId: userId
    });
    
    // Keep only last 15 messages to prevent memory issues
    if (context.conversationHistory.length > 15) {
      context.conversationHistory = context.conversationHistory.slice(-15);
    }
    
    // Generate contextual reply
    const reply = await getContextualReply(message, userId, context);
    
    // Add bot response to history
    context.conversationHistory.push({
      bot: reply,
      timestamp: new Date()
    });
    
    // Update session BEFORE sending response
    sessions.set(sessionId, context);
    
    console.log('Context after processing:', {
      lastIntent: context.lastIntent,
      tripPlanningStep: context.tripPlanningStep,
      modifyingDay: context.modifyingDay,
      modificationStep: context.modificationStep,
      bookingStep: context.bookingStep,
      tripData: Object.keys(context.tripData || {}).length > 0 ? 'Present' : 'Empty'
    });
    console.log('=== END REQUEST ===');
    
    res.json({ 
      response: reply,
      sessionId: sessionId,
      context: {
        lastIntent: context.lastIntent,
        conversationLength: context.conversationHistory.length,
        tripPlanningStep: context.tripPlanningStep,
        bookingStep: context.bookingStep,
        modifyingDay: context.modifyingDay
      }
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Something went wrong! Please try again.',
      errorCode: 'CHAT_ERROR'
    });
  }
});

// Admin endpoint to reload canned replies
router.post('/reload-replies', (req, res) => {
  try {
    const newTable = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../cannedReplies.json'), 'utf-8')
    );
    replyTable = newTable;
    res.json({ status: 'Canned replies reloaded successfully', timestamp: new Date() });
  } catch (error) {
    console.error('Error reloading replies:', error);
    res.status(500).json({ error: 'Invalid JSON or file not found' });
  }
});

// Clear specific session endpoint
router.post('/clear-session', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
    res.json({ status: 'Session cleared', sessionId });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// Get session info (for debugging)
router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const context = sessions.get(sessionId);
  
  if (context) {
    res.json({
      sessionId,
      lastIntent: context.lastIntent,
      conversationLength: context.conversationHistory.length,
      createdAt: context.createdAt,
      tripPlanningStep: context.tripPlanningStep,
      tripData: context.tripData,
      modifyingDay: context.modifyingDay,
      modificationStep: context.modificationStep,
      bookingStep: context.bookingStep,
      lastActivity: context.conversationHistory[context.conversationHistory.length - 1]?.timestamp
    });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    activeSessions: sessions.size,
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

module.exports = router;
