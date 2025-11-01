from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json
import os
from typing import Dict, Any, List
import asyncio
import re

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face API configuration
HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
HF_TOKEN = os.getenv("HUGGING_FACE_TOKEN", "")

async def generate_ai_content(prompt: str) -> str:
    """Generate content using Hugging Face Inference API"""
    if not HF_TOKEN:
        return ""
    
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 500,
            "temperature": 0.7,
            "do_sample": True,
            "top_p": 0.9,
            "repetition_penalty": 1.2
        }
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(HF_API_URL, headers=headers, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    generated_text = result[0].get("generated_text", "")
                    # Clean up the response
                    if prompt in generated_text:
                        generated_text = generated_text.replace(prompt, "").strip()
                    return generated_text
                return ""
            else:
                print(f"HF API Error: {response.status_code} - {response.text}")
                return ""
    except Exception as e:
        print(f"Error calling HF API: {e}")
        return ""

def create_design_prompt(idea: str) -> str:
    """Create a detailed prompt for AI design generation"""
    return f"""
Create a professional website design concept for: {idea}

Generate:
1. A catchy business name and headline
2. Engaging value proposition
3. Key features and services
4. Customer testimonials
5. Call-to-action phrases

Make it specific and professional.
"""

def extract_business_name(idea: str) -> str:
    """Extract a meaningful business name from the idea"""
    # Look for quoted names first
    quoted_match = re.search(r'"([^"]+)"', idea)
    if quoted_match:
        return quoted_match.group(1)
    
    # Look for patterns like "called X" or "named X"
    pattern_match = re.search(r'(?:called|named)\s+([A-Za-z\s]+?)(?:\s|,|\.)', idea)
    if pattern_match:
        return pattern_match.group(1).strip()
    
    # Extract meaningful words
    common_words = ['a', 'an', 'the', 'for', 'to', 'of', 'in', 'on', 'at', 'by', 'with', 'app', 'website', 'platform', 'service', 'business', 'i', 'want', 'develop', 'create', 'build']
    words = [word.strip('.,!?;:') for word in idea.split() if word.lower() not in common_words and len(word) > 2]
    
    # Take first 2-3 meaningful words
    if len(words) >= 2:
        return " ".join(words[:3]).title()
    elif len(words) == 1:
        return words[0].title()
    else:
        return "Your Business"

async def parse_ai_response_to_blueprint(ai_response: str, idea: str) -> Dict[str, Any]:
    """Parse AI response and create a blueprint structure"""
    
    business_name = extract_business_name(idea)
    
    # Create basic sections
    sections = [
        {
            "type": "hero",
            "headline": f"Welcome to {business_name}",
            "subtext": ai_response[:200] + "..." if len(ai_response) > 200 else ai_response or idea[:200] + "...",
            "cta": "Get Started Today",
            "background": "from-blue-600 to-purple-700"
        },
        {
            "type": "features",
            "title": "Key Features",
            "items": [
                {"title": "Professional Design", "icon": "⭐", "description": "Modern and responsive design"},
                {"title": "User Friendly", "icon": "👥", "description": "Intuitive user experience"},
                {"title": "Fast Performance", "icon": "⚡", "description": "Optimized for speed"},
                {"title": "Secure", "icon": "🔒", "description": "Built with security in mind"}
            ]
        },
        {
            "type": "about",
            "title": f"About {business_name}",
            "content": ai_response or f"{business_name} is dedicated to providing exceptional service and value to our customers."
        },
        {
            "type": "testimonials",
            "title": "What Our Customers Say",
            "items": [
                {"text": f"Excellent service and quality. {business_name} exceeded expectations!", "author": "Alex Johnson", "role": "Satisfied Client", "rating": 5},
                {"text": f"Professional and reliable. Highly recommend {business_name}!", "author": "Sam Wilson", "role": "Happy Customer", "rating": 5},
                {"text": f"Outstanding experience. {business_name} truly cares about clients.", "author": "Jordan Lee", "role": "Loyal Customer", "rating": 5}
            ]
        },
        {
            "type": "footer",
            "text": f"© 2025 {business_name} — Powered by AI Design",
            "links": [
                {"text": "Privacy Policy", "url": "#privacy"},
                {"text": "Terms of Service", "url": "#terms"},
                {"text": "Contact Us", "url": "#contact"}
            ]
        }
    ]
    
    # Create basic page structure
    pages = [
        {
            "name": "Home",
            "sections": ["hero", "features", "about", "testimonials", "footer"],
            "description": "Main landing page showcasing key features"
        },
        {
            "name": "About",
            "sections": ["hero", "about", "footer"],
            "description": "Company information and story"
        },
        {
            "name": "Services",
            "sections": ["hero", "features", "footer"],
            "description": "Overview of services offered"
        },
        {
            "name": "Contact",
            "sections": ["hero", "footer"],
            "description": "Contact information and inquiry form"
        }
    ]
    
    blueprint = {
        "title": business_name,
        "description": ai_response[:200] + "..." if len(ai_response) > 200 else ai_response or idea[:200] + "...",
        "sections": sections,
        "design": {
            "colorScheme": {
                "primary": "#6366f1",
                "secondary": "#8b5cf6",
                "accent": "#06b6d4"
            },
            "typography": {
                "headings": "Inter, system-ui, sans-serif",
                "body": "Inter, system-ui, sans-serif"
            },
            "layout": "modern-grid"
        },
        "pages": pages
    }
    
    return blueprint

@app.post("/generate")
async def generate_blueprint(request: Request):
    """Generate a website blueprint based on the provided idea"""
    try:
        body = await request.json()
        idea = body.get("idea", "").strip()
        
        # Validate input
        if not idea:
            raise HTTPException(status_code=400, detail="Idea is required")
        
        # Create AI prompt
        prompt = create_design_prompt(idea)
        
        # Generate AI content
        ai_response = await generate_ai_content(prompt)
        
        # Parse response to blueprint
        blueprint = await parse_ai_response_to_blueprint(ai_response, idea)
        
        return {
            "success": True,
            "blueprint": blueprint,
            "ai_response": ai_response
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in generate_blueprint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/")
async def root():
    return {"message": "ProtoAI Backend is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
