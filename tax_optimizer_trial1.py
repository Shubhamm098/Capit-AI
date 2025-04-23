import pandas as pd
import numpy as np
from dataclasses import dataclass
from typing import List, Dict

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

class TaxOptimizer:
    def __init__(self):
        # Define tax slabs for India (2023-24)
        self.tax_slabs = [
            (250000, 0),
            (500000, 0.05),
            (1000000, 0.20),
            (float('inf'), 0.30)
        ]
        
        # Maximum deduction limits
        self.max_limits = {
            '80C': 150000,  # PPF, ELSS, etc.
            '80D': 25000,   # Health Insurance
            'NPS': 50000,   # Additional NPS deduction
            'HRA': None,    # Depends on city and basic salary
            'Home_Loan': 200000  # Home loan interest deduction
        }

    def calculate_taxable_income(self, taxpayer: TaxPayer) -> Dict:
        gross_income = taxpayer.income
        
        # Calculate deductions
        deductions = {
            '80C': min(taxpayer.ppf + taxpayer.elss, self.max_limits['80C']),
            '80D': min(taxpayer.health_insurance, self.max_limits['80D']),
            'NPS': min(taxpayer.nps, self.max_limits['NPS']),
            'Home_Loan': min(taxpayer.home_loan, self.max_limits['Home_Loan']),
            'HRA': min(taxpayer.house_rent, taxpayer.income * 0.40)  # Simplified HRA calculation
        }
        
        total_deductions = sum(deductions.values())
        taxable_income = max(0, gross_income - total_deductions)
        
        return {
            'gross_income': gross_income,
            'deductions': deductions,
            'total_deductions': total_deductions,
            'taxable_income': taxable_income
        }

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

    def get_optimization_recommendations(self, taxpayer: TaxPayer) -> List[str]:
        current_tax_info = self.calculate_taxable_income(taxpayer)
        current_tax = self.calculate_tax(current_tax_info['taxable_income'])
        
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

        # Check for Health Insurance optimization
        if taxpayer.health_insurance < self.max_limits['80D']:
            remaining_80d = self.max_limits['80D'] - taxpayer.health_insurance
            recommendations.append(
                f"You can claim up to ₹{remaining_80d:,.2f} more through health insurance premium under Section 80D"
            )

        # Home Loan recommendation
        if taxpayer.home_loan == 0:
            recommendations.append(
                "Consider taking a home loan if planning to buy a house. You can claim up to ₹2,00,000 in interest deduction"
            )

        # House Rent recommendation
        if taxpayer.house_rent == 0:
            recommendations.append(
                "If you're paying rent, make sure to claim HRA benefits by obtaining rent receipts"
            )

        return {
            'current_tax': current_tax,
            'taxable_income': current_tax_info['taxable_income'],
            'total_deductions': current_tax_info['total_deductions'],
            'recommendations': recommendations
        }

def main():
    # Example usage
    taxpayer = TaxPayer(
        income=800000,
        expenses=200000,
        health_insurance=20000,
        home_loan=0,
        elss=50000,
        nps=20000,
        ppf=50000,
        house_rent=120000,
        previous_tax_amount=80000,
        state="MH",
        filing_status="Single",
        tax_credits=0
    )
    
    optimizer = TaxOptimizer()
    result = optimizer.get_optimization_recommendations(taxpayer)
    
    print("\n=== Tax Analysis Report ===")
    print(f"Current Taxable Income: ₹{result['taxable_income']:,.2f}")
    print(f"Total Deductions: ₹{result['total_deductions']:,.2f}")
    print(f"Estimated Tax: ₹{result['current_tax']:,.2f}")
    print("\nRecommendations for Tax Optimization:")
    for i, rec in enumerate(result['recommendations'], 1):
        print(f"{i}. {rec}")

if __name__ == "__main__":
    main()