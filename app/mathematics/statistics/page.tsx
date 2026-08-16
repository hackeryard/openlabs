import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Probability & Statistics Sandbox - Interactive Mathematics Lab | OpenLabs",
  description:
    "Master probability and mathematical statistics with our interactive simulation laboratory. Explore the Galton Board (bean machine), Central Limit Theorem, probability distributions (Normal, Binomial, Poisson), and Ordinary Least Squares (OLS) linear regression.",
  keywords: [
    "probability visualizer",
    "galton board simulator",
    "central limit theorem interactive",
    "normal distribution bell curve",
    "binomial distribution calculator",
    "linear regression least squares",
    "AP Statistics",
    "STEM mathematics",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/statistics",
  },
  openGraph: {
    title: "Probability & Statistics Sandbox - Interactive Mathematics Lab | OpenLabs",
    description:
      "Simulate the Galton Board, Central Limit Theorem, confidence intervals, and linear regressions in real time.",
    url: "https://www.openlabs.org.in/mathematics/statistics",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Probability & Statistics Sandbox Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Probability & Statistics Sandbox - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore the Galton Board, Central Limit Theorem, and linear regressions in real time.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "statistics",
  subject: "Mathematics",
  title: "Probability & Statistics Sandbox",
  description:
    "Galton bean machine, Central Limit Theorem, probability distributions, and Ordinary Least Squares linear regression.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription:
    "Bridge empirical sampling and theoretical mathematics through physical bean machine models, sampling distribution experiments, and regression modeling.",
  theory: {
    content: `<p><strong>Probability and Statistics</strong> form the mathematical science of uncertainty, randomness, data modeling, and statistical inference.</p>
    <h3>The Galton Board (Bean Machine)</h3>
    <p>Invented by Sir Francis Galton in 1889, the board drops balls through a triangular grid of pins. At each pin, a ball bounces left or right with equal probability <code>p = 0.5</code>. After passing <code>N</code> rows, the number of right bounces follows a <strong>Binomial distribution</strong> <code>B(N, p)</code>, forming an unmistakable bell-shaped Gaussian curve in the accumulator bins.</p>
    <h3>The Central Limit Theorem (CLT)</h3>
    <p>One of the most remarkable theorems in mathematics: given independent and identically distributed (i.i.d.) random variables with finite mean <code>\\mu</code> and variance <code>\\sigma^2</code>, the distribution of the sample mean <code>\\bar{X}_n</code> converges to a normal distribution as sample size <code>n \\to \\infty</code>:</p>
    <p><code>\\bar{X}_n \\xrightarrow{d} \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)</code></p>
    <p>This holds true regardless of the parent population's original shape (uniform, skewed exponential, or bimodal).</p>
    <h3>Ordinary Least Squares (OLS) Linear Regression</h3>
    <p>Linear regression models the relationship between independent variable <code>X</code> and dependent variable <code>Y</code> by fitting a line <code>\\hat{y} = mx + b</code> that minimizes the sum of squared vertical residuals (errors):</p>
    <p><code>m = \\frac{\\text{Cov}(X, Y)}{\\text{Var}(X)}, \\quad b = \\bar{y} - m\\bar{x}</code></p>`,
  },
  mathematicalFoundations: {
    equations: [
      "P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}",
      "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}",
      "\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}}",
      "r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}",
      "R^2 = r^2",
    ],
    explanation:
      "Probability models theoretical expectations, while statistical inference uses sample means and regression metrics to estimate population parameters.",
  },
  learningObjectives: [
    "Observe how binomial trials in a peg lattice converge to a continuous Gaussian bell curve.",
    "Understand the Central Limit Theorem and observe variance reduction as sample size n increases (σ/√n).",
    "Calculate cumulative tail probabilities and confidence intervals using the 68-95-99.7 empirical rule.",
    "Fit Ordinary Least Squares regression lines and interpret Pearson's r and coefficient of determination R².",
  ],
  realWorldApplications: [
    "Machine learning supervised regression, loss function optimization, and residual diagnostics",
    "Medical randomized controlled trials (RCTs) and drug efficacy confidence interval estimation",
    "Financial quantitative risk analysis, Value at Risk (VaR), and portfolio diversification",
    "Quality engineering, Six Sigma manufacturing, and defect rate tolerance testing",
  ],
  howItWorks:
    "Drop balls through the Galton Board to build an empirical binomial distribution, test the Central Limit Theorem across skewed populations, or click to add data points on the scatter plot and watch the OLS regression line adapt.",
  faqs: [
    {
      question: "Why is the Central Limit Theorem so important?",
      answer:
        "Because it allows statisticians to make normal-distribution-based inferences about population means even when the underlying population is non-normal, provided the sample size is sufficiently large (typically n ≥ 30).",
    },
    {
      question: "What does the R² metric mean in linear regression?",
      answer:
        "R² (coefficient of determination) represents the percentage of total variance in the dependent variable Y that is explained by the linear relationship with X.",
    },
    {
      question: "What is the difference between PDF and PMF?",
      answer:
        "A Probability Mass Function (PMF) gives the exact probability for discrete random variables (e.g. dice, binomial), while a Probability Density Function (PDF) represents continuous variables where probabilities are given by the area under the curve over an interval.",
    },
  ],
  relatedExperiments: [],
};

export default function StatisticsLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/statistics"
    />
  );
}
