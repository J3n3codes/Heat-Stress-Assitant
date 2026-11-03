Click to view  https://j3n3codes.github.io/Heat-Stress-Assitant/
# Heat Stress Assistant

An evidence-informed chatbot prototype designed to provide general guidance on exercise, hydration, nutrition, cooling strategies, and recovery following heat stress.

# Project Overview
Heat exposure and exercise in hot environments can affect hydration, thermoregulation, exercise performance, and recovery.

The Heat Stress Assistant explores how a lightweight question-matching chatbot can retrieve relevant guidance from predefined response categories.

The project combines literature-informed response development with a simple retrieval-based chatbot interface.

# Objectives

- Provide accessible, general information about heat stress recovery.
- Organize guidance into relevant categories.
- Match user questions with predefined training examples.
- Retrieve corresponding response templates.
- Demonstrate a lightweight, non-generative chatbot.

# Guidance Categories

1. Exercise Guidance
2. Hydration Guidance
3. Diet and Recovery Nutrition
4. Cooling Strategies
5. Warning Symptoms
6. Greeting

# Model Development

The project explores three approaches:

# Version 1: Rule-Based Matching
Uses predefined question patterns and exact matching to retrieve responses.

# Version 2: TF-IDF and Cosine Similarity
Uses TF-IDF vectorization and cosine similarity to identify the closest matching training question.

# Version 3: Embedding-Based Prototype
Explores sentence embeddings for semantic question matching.

# Web Deployment
The public-facing chatbot uses HTML, CSS, and JavaScript so it can run through GitHub Pages without requiring a Python server.

The browser implementation is a lightweight retrieval-based version and is distinct from the Python prototypes.

# Project Structure

```text
Heat-Stress-Assistant/

 index.html
 style.css
 script.js
\
data/
\   ─ training_examples.csv
\   ─ response_templates.json
 docs/
\   ─ Model Approach.md
\   ─ Version Comparison.md
\   ─ lit_review/

chatbot/
\- app.py
 app_version2.py
\- app_version3.py# Heat-Stress-Assitant
