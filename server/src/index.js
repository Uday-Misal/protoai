import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Load environment variables
dotenv.config();

const app = express();

// ✅ Allow frontend access
app.use(cors({
    origin: process.env.FRONTEND_URL || "*"
}));

// ✅ Increase JSON payload size
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Supabase Client with your credentials
const supabaseUrl = process.env.SUPABASE_URL || "https://mypoerbhskkgbmpgrqqq.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cG9lcmJoc2trZ2JtcGdycXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5Mzc3ODMsImV4cCI6MjA3NzUxMzc4M30.V3jyDBk1Eg6kOjQbnuRUm4KxFcmYhRmfBzUULhlFXjs";
const supabase = createClient(supabaseUrl, supabaseKey);

// Health check endpoint
app.get("/", (req, res) => {
    res.send("ProtoAI Backend Running with Supabase");
});

// Signup
app.post("/api/auth/signup", async (req, res) => {
    const { email, password, name } = req.body;
    
    try {
        // Check if user already exists
        const { data: existingUsers } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .limit(1);
            
        if (existingUsers && existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                error: "User with this email already exists" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into Supabase
        const { data, error } = await supabase
            .from('users')
            .insert([
                { email, password: hashedPassword, name: name || '' }
            ])
            .select();
            
        if (error) throw error;
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: data[0].id, email },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );
        
        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: data[0].id,
                email,
                name: name || ''
            }
        });
        
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Server error during signup" 
        });
    }
});

// Login
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find user by email
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .limit(1);
            
        if (error) throw error;
        
        if (!users || users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                error: "Invalid email or password" 
            });
        }
        
        const user = users[0];
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                error: "Invalid email or password" 
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );
        
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Server error during login" 
        });
    }
});

// Get user profile
app.get("/api/auth/profile", async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        
        // Get user from Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, name')
            .eq('id', decoded.userId)
            .single();
            
        if (error || !user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        res.json({ user });
        
    } catch (error) {
        console.error("Profile error:", error);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
});

// Generate AI blueprint
app.post("/api/ai/generate", async (req, res) => {
    try {
        // Forward to your AI service
        const response = await fetch("http://127.0.0.1:8000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("AI generation error:", error);
        res.status(500).json({ error: "Failed to generate blueprint" });
    }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Database: Supabase`);
        console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
}

// Export the Express API for Vercel
export default app;

