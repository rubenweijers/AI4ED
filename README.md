# AI-Enhanced Physics Learning Platform

This is a web-based research platform implementing a pre-post test study design described in our paper: [**"Physics Learning with an AI Peer" (arXiv:2504.00408)**](https://arxiv.org/abs/2504.00408). The site supports an interactive learning experience in physics education, combining assessment with AI-guided peer dialogue.

## 🧠 Study Design Overview

The platform follows a **pre-post test** methodology to evaluate conceptual learning gains in physics:

1. **Pre-Test (FCI 1):**  
   Users begin by completing a 30-question multiple-choice Force Concept Inventory (FCI) questionnaire.

2. **Intervention Phase:**  
   - **Experimental Group:** Participants engage in dialogue with an AI peer to reflect on and discuss the questions they got wrong in the FCI.  
   - **Control Group:** Users take a physics history questionnaire, and talk with an AI about those physics history questions, rather than the questions they answered incorrectly.

3. **Post-Test (FCI 2):**  
   All participants then complete a different 30-question FCI, we evaluate changes in understanding.

## 🛠️ Tech Stack

- **Frontend:** [Vue 3](https://vuejs.org/)
- **Backend / API Routes:** [Node.js](https://nodejs.org/)
- **Authentication & Database:** [Supabase](https://supabase.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
