import os
from typing import List, Dict, Optional
from dataclasses import dataclass
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from flask import Flask, request, jsonify
from flask_cors import CORS
from phi.agent import Agent
from phi.model.groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@dataclass
class TaxPayer:
    income: float
    expenses: float
    health_insurance: float
    home_loan: float
    elss: float
    nps: float
    ppf: float
    house_rent: float
    previous_tax_amount: float
    state: str
    filing_status: str
    tax_credits: float
    age: int
    risk_appetite: str  # 'Low', 'Medium', 'High'
    investment_horizon: str  # 'Short', 'Medium', 'Long'
    existing_investments: Dict[str, float]

class TaxOptimizer:
    def __init__(self):
        self.risk_classifier = self._load_risk_classifier()
        self.tax_slabs = self._get_current_tax_slabs()
        self.max_limits = self._get_deduction_limits()
        self.historical_data = self._load_historical_data()
        self.investment_models = self._train_investment_models()
        
    def _load_risk_classifier(self):
        try:
            # Initialize Groq agent for risk analysis
            risk_agent = Agent(
                model=Groq(id="llama-3.3-70b-versatile"),
                instructions=[
                    "You are a financial risk analyst. Analyze the given profile and provide risk assessment.",
                    "Consider age, income, risk appetite, and investment horizon.",
                    "Return risk score and category (Low/Medium/High)."
                ],
                show_tool_calls=False,
                markdown=True
            )
            return risk_agent
        except Exception as e:
            print(f"Warning: Could not initialize Groq agent. Using simple risk analysis. Error: {str(e)}")
            return None

    def _get_current_tax_slabs(self):
        return [
            (250000, 0),
            (500000, 0.05),
            (1000000, 0.20),
            (float('inf'), 0.30)
        ]

    def _get_deduction_limits(self):
        return {
            '80C': 150000,
            '80D': 25000,
            'NPS': 50000,
            'HRA': None,
            'Home_Loan': 200000,
            '80E': 200000,  # Education loan
            '80G': None,    # Donations
            '80TTA': 10000  # Savings account interest
        }

    def _load_historical_data(self):
        return pd.DataFrame()

    def _train_investment_models(self):
        models = {}
        for investment_type in ['ELSS', 'NPS', 'PPF']:
            model = RandomForestRegressor()
            # Train model with historical data
            # models[investment_type] = model
        return models

    def calculate_taxable_income(self, taxpayer: TaxPayer) -> Dict:
        gross_income = taxpayer.income
        
        deductions = {
            '80C': self._calculate_80c_deduction(taxpayer),
            '80D': min(taxpayer.health_insurance, self.max_limits['80D']),
            'NPS': self._calculate_nps_deduction(taxpayer),
            'Home_Loan': self._calculate_home_loan_deduction(taxpayer),
            'HRA': self._calculate_hra_deduction(taxpayer),
            '80E': self._calculate_education_loan_deduction(taxpayer),
            '80G': self._calculate_donation_deduction(taxpayer),
            '80TTA': self._calculate_savings_interest_deduction(taxpayer)
        }
        
        total_deductions = sum(deductions.values())
        taxable_income = max(0, gross_income - total_deductions)
        
        return {
            'gross_income': gross_income,
            'deductions': deductions,
            'total_deductions': total_deductions,
            'taxable_income': taxable_income
        }

    def _calculate_80c_deduction(self, taxpayer: TaxPayer) -> float:
        total_80c = taxpayer.ppf + taxpayer.elss
        return min(total_80c, self.max_limits['80C'])

    def _calculate_nps_deduction(self, taxpayer: TaxPayer) -> float:
        base_deduction = min(taxpayer.nps, 50000)
        additional_deduction = min(taxpayer.nps - 50000, 50000) if taxpayer.nps > 50000 else 0
        return base_deduction + additional_deduction

    def _calculate_hra_deduction(self, taxpayer: TaxPayer) -> float:
        if taxpayer.house_rent == 0:
            return 0
        
        city_class = self._get_city_classification(taxpayer.state)
        hra_percentage = 0.5 if city_class == 'Metro' else 0.4
        
        hra_exemption = min(
            taxpayer.house_rent,
            taxpayer.income * hra_percentage,
            taxpayer.house_rent - 0.1 * taxpayer.income
        )
        return max(0, hra_exemption)

    def _get_city_classification(self, state: str) -> str:
        metro_states = ['MH', 'DL', 'KA', 'TN', 'WB']
        return 'Metro' if state in metro_states else 'Non-Metro'

    def calculate_tax(self, taxable_income: float) -> float:
        tax = 0
        remaining_income = taxable_income
        prev_slab = 0
        
        for slab, rate in self.tax_slabs:
            if remaining_income <= 0:
                break
            
            taxable_in_slab = min(remaining_income, slab - prev_slab)
            tax += taxable_in_slab * rate
            remaining_income -= taxable_in_slab
            prev_slab = slab
            
        return tax

    def get_optimization_recommendations(self, taxpayer: TaxPayer) -> Dict:
        current_tax_info = self.calculate_taxable_income(taxpayer)
        current_tax = self.calculate_tax(current_tax_info['taxable_income'])
        
        # Generate recommendations using Groq
        recommendations = self._generate_groq_recommendations(taxpayer, current_tax_info)
        
        # Add ML-based investment recommendations
        investment_recs = self._generate_investment_recommendations(taxpayer)
        recommendations.extend(investment_recs)
        
        # Add risk assessment
        risk_analysis = self._analyze_risk_profile(taxpayer)
        
        return {
            'current_tax': current_tax,
            'taxable_income': current_tax_info['taxable_income'],
            'total_deductions': current_tax_info['total_deductions'],
            'recommendations': recommendations,
            'risk_analysis': risk_analysis,
            'projected_savings': self._calculate_projected_savings(taxpayer, recommendations)
        }

    def _generate_groq_recommendations(self, taxpayer: TaxPayer, tax_info: Dict) -> List[str]:
        # Initialize Groq agent for tax recommendations
        tax_agent = Agent(
            model=Groq(id="llama-3.3-70b-versatile"),
            instructions=[
                "You are an expert Indian tax consultant. Provide detailed, personalized tax optimization recommendations.",
                "Consider the taxpayer's income, age, risk appetite, and investment horizon.",
                "Provide specific, actionable recommendations to optimize taxes.",
                "Return only the recommendations as a numbered list, without any additional text or formatting."
            ],
            show_tool_calls=False,
            markdown=True
        )
        
        prompt = f"""
        Analyze the following taxpayer information and provide specific recommendations:
        Income: {taxpayer.income}
        Age: {taxpayer.age}
        Risk Appetite: {taxpayer.risk_appetite}
        Investment Horizon: {taxpayer.investment_horizon}
        Current Deductions: {tax_info['deductions']}
        Taxable Income: {tax_info['taxable_income']}
        """
        
        try:
            response = tax_agent.run(prompt)
            # Split the response into lines and filter out empty lines
            recommendations = [line.strip() for line in response.content.split('\n') if line.strip()]
            return recommendations
        except Exception as e:
            print(f"Error generating Groq recommendations: {str(e)}")
            return ["Consider maximizing Section 80C deductions", 
                   "Explore NPS contributions for additional tax benefits",
                   "Review health insurance coverage for Section 80D benefits"]

    def _generate_investment_recommendations(self, taxpayer: TaxPayer) -> List[str]:
        recommendations = []
        
        # Check for 80C optimization
        total_80c = taxpayer.ppf + taxpayer.elss
        if total_80c < self.max_limits['80C']:
            remaining_80c = self.max_limits['80C'] - total_80c
            recommendations.append(
                f"You can invest ₹{remaining_80c:,.2f} more under Section 80C through PPF, ELSS, or other eligible investments"
            )

        # Check for NPS optimization
        if taxpayer.nps < self.max_limits['NPS']:
            remaining_nps = self.max_limits['NPS'] - taxpayer.nps
            recommendations.append(
                f"You can invest ₹{remaining_nps:,.2f} more in NPS under Section 80CCD(1B)"
            )

        return recommendations

    def _analyze_risk_profile(self, taxpayer: TaxPayer) -> Dict:
        if self.risk_classifier is None:
            # Simple risk analysis based on age, income, and risk appetite
            risk_score = self._calculate_simple_risk_score(taxpayer)
            return {
                'risk_score': [risk_score, 1-risk_score],
                'risk_category': self._categorize_simple_risk(risk_score)
            }
        
        risk_text = f"""
        Age: {taxpayer.age}
        Income: {taxpayer.income}
        Risk Appetite: {taxpayer.risk_appetite}
        Investment Horizon: {taxpayer.investment_horizon}
        """
        
        try:
            response = self.risk_classifier.run(risk_text)
            # Extract numeric values from the response
            risk_scores = []
            for score in response.content.split(','):
                try:
                    risk_scores.append(float(score.strip()))
                except ValueError:
                    continue
            
            if not risk_scores:
                # Fallback to simple risk analysis if parsing fails
                risk_score = self._calculate_simple_risk_score(taxpayer)
                risk_scores = [risk_score, 1-risk_score]
            
            return {
                'risk_score': risk_scores,
                'risk_category': self._categorize_risk(risk_scores)
            }
        except Exception as e:
            print(f"Error in risk analysis: {str(e)}")
            # Fallback to simple risk analysis
            risk_score = self._calculate_simple_risk_score(taxpayer)
            return {
                'risk_score': [risk_score, 1-risk_score],
                'risk_category': self._categorize_simple_risk(risk_score)
            }

    def _calculate_simple_risk_score(self, taxpayer: TaxPayer) -> float:
        # Age factor (younger = higher risk tolerance)
        age_factor = max(0, min(1, (60 - taxpayer.age) / 40))
        
        # Income factor (higher income = higher risk tolerance)
        income_factor = min(1, taxpayer.income / 2000000)  # Cap at 20L
        
        # Risk appetite factor
        risk_appetite_map = {'Low': 0.2, 'Medium': 0.5, 'High': 0.8}
        risk_appetite_factor = risk_appetite_map.get(taxpayer.risk_appetite, 0.5)
        
        # Investment horizon factor
        horizon_map = {'Short': 0.3, 'Medium': 0.6, 'Long': 0.8}
        horizon_factor = horizon_map.get(taxpayer.investment_horizon, 0.5)
        
        # Weighted average of factors
        return (age_factor * 0.2 + income_factor * 0.3 + 
                risk_appetite_factor * 0.3 + horizon_factor * 0.2)

    def _categorize_simple_risk(self, risk_score: float) -> str:
        if risk_score < 0.3:
            return "Low"
        elif risk_score < 0.7:
            return "Medium"
        else:
            return "High"

    def _categorize_risk(self, risk_score: List[float]) -> str:
        if not risk_score:
            return "Medium"
        if len(risk_score) == 1:
            return "Low" if risk_score[0] < 0.3 else "Medium" if risk_score[0] < 0.7 else "High"
        return "Low" if risk_score[0] > 0.5 else "Medium" if risk_score[1] > 0.5 else "High"

    def _calculate_projected_savings(self, taxpayer: TaxPayer, recommendations: List[str]) -> Dict:
        projected_deductions = self._simulate_recommendations(taxpayer, recommendations)
        current_tax = self.calculate_tax(self.calculate_taxable_income(taxpayer)['taxable_income'])
        projected_tax = self.calculate_tax(projected_deductions['taxable_income'])
        
        return {
            'current_tax': current_tax,
            'projected_tax': projected_tax,
            'potential_savings': current_tax - projected_tax,
            'savings_percentage': ((current_tax - projected_tax) / current_tax) * 100
        }

    def _simulate_recommendations(self, taxpayer: TaxPayer, recommendations: List[str]) -> Dict:
        # Create a copy of the taxpayer with simulated changes
        simulated_taxpayer = TaxPayer(
            income=taxpayer.income,
            expenses=taxpayer.expenses,
            health_insurance=taxpayer.health_insurance,
            home_loan=taxpayer.home_loan,
            elss=taxpayer.elss,
            nps=taxpayer.nps,
            ppf=taxpayer.ppf,
            house_rent=taxpayer.house_rent,
            previous_tax_amount=taxpayer.previous_tax_amount,
            state=taxpayer.state,
            filing_status=taxpayer.filing_status,
            tax_credits=taxpayer.tax_credits,
            age=taxpayer.age,
            risk_appetite=taxpayer.risk_appetite,
            investment_horizon=taxpayer.investment_horizon,
            existing_investments=taxpayer.existing_investments.copy()
        )
        
        # Apply recommendations
        for rec in recommendations:
            if "80C" in rec:
                # Maximize 80C deductions
                simulated_taxpayer.elss = self.max_limits['80C'] - simulated_taxpayer.ppf
            elif "NPS" in rec:
                # Maximize NPS deductions
                simulated_taxpayer.nps = self.max_limits['NPS']
            elif "health insurance" in rec.lower():
                # Maximize health insurance
                simulated_taxpayer.health_insurance = self.max_limits['80D']
            elif "home loan" in rec.lower():
                # Assume taking a home loan
                simulated_taxpayer.home_loan = self.max_limits['Home_Loan']
        
        return self.calculate_taxable_income(simulated_taxpayer)

    def _calculate_home_loan_deduction(self, taxpayer: TaxPayer) -> float:
        """Calculate home loan interest deduction under Section 24(b)"""
        if taxpayer.home_loan == 0:
            return 0
        return min(taxpayer.home_loan, self.max_limits['Home_Loan'])

    def _calculate_education_loan_deduction(self, taxpayer: TaxPayer) -> float:
        """Calculate education loan interest deduction under Section 80E"""
        # For simplicity, we'll assume education loan is part of expenses
        # In a real implementation, this would be a separate field
        return min(taxpayer.expenses * 0.1, self.max_limits['80E'])

    def _calculate_donation_deduction(self, taxpayer: TaxPayer) -> float:
        """Calculate donation deduction under Section 80G"""
        # For simplicity, we'll assume donations are part of expenses
        # In a real implementation, this would be a separate field
        return min(taxpayer.expenses * 0.1, self.max_limits['80G'] or float('inf'))

    def _calculate_savings_interest_deduction(self, taxpayer: TaxPayer) -> float:
        """Calculate savings account interest deduction under Section 80TTA"""
        # For simplicity, we'll assume savings interest is part of income
        # In a real implementation, this would be a separate field
        return min(taxpayer.income * 0.01, self.max_limits['80TTA'])

# Flask setup
app = Flask(__name__, static_folder='static')
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_taxpayer():
    try:
        data = request.json
        optimizer = TaxOptimizer()
        taxpayer = TaxPayer(**data)
        result = optimizer.get_optimization_recommendations(taxpayer)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)