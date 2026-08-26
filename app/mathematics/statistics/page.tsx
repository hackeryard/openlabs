import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Probability & Statistics Sandbox | OpenLabs",
  description: "Master probability and mathematical statistics with our interactive simulation laboratory. Explore the Galton Board, Central Limit Theorem, probability distributions, and Ordinary Least Squares (OLS) regression.",
  keywords: [
    "probability visualizer online",
    "galton board simulator",
    "central limit theorem interactive",
    "normal distribution bell curve",
    "binomial distribution calculator",
    "linear regression least squares",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/statistics",
  },
  openGraph: {
    title: "Probability & Statistics Sandbox | OpenLabs",
    description: "Simulate the Galton Board, Central Limit Theorem, confidence intervals, and linear regressions in real time.",
    url: "https://www.openlabs.org.in/mathematics/statistics",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/statistics-hero.png",
        alt: "Probability & Statistics Sandbox Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Probability & Statistics Sandbox | OpenLabs",
    description: "Explore the Galton Board, Central Limit Theorem, and linear regressions in real time.",
    images: ["https://www.openlabs.org.in/images/mathematics/statistics-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function StatisticsLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="statistics"
      title="Probability, Statistics & Central Limit Theorem"
      description="Interactive mathematical statistics laboratory modeling the Galton bean machine, Central Limit Theorem convergence, continuous probability distributions, and OLS regression."
      heroDescription="Bridge empirical random sampling and theoretical distributions. Drop thousands of steel balls through a physical Galton pin board, draw random sample means from skewed populations to observe the Central Limit Theorem in action, and fit linear regression trendlines."
      theory="Probability and Statistics provide the mathematical foundation for reasoning under uncertainty. The Central Limit Theorem (CLT) states that as sample size n increases (typically n ≥ 30), the sampling distribution of the sample mean (x̄) approaches a Gaussian Normal Distribution regardless of the underlying population's shape. In bivariate regression, Ordinary Least Squares (OLS) minimizes the sum of squared vertical residuals (errors) between observed points and the fitted trendline."
      formula="f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{-\frac{(x - \mu)^2}{2\sigma^2}} \quad \text{and} \quad z = \frac{\bar{x} - \mu}{\sigma / \sqrt{n}} \quad \text{and} \quad \hat{\beta}_1 = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}"
      formulaLabel="Gaussian Probability Density & Central Limit Standard Error"
      launchUrl="/labs/mathematics/statistics"
      heroImageUrl="/images/mathematics/statistics-hero.png"
      visualLabel="Galton Board & Central Limit Theorem Engine"
      visualDetail="Interactive Bean Machine Drop • Uniform/Exponential/Bimodal Population Generators • OLS Scatter Plotter"
      accent={{ primary: "#d97706", secondary: "#0284c7", warm: "#10b981" }}
      learningObjectives={[
        "Demonstrate how repeated binomial Bernoulli trials converge to the continuous Gaussian Bell Curve.",
        "Verify the Central Limit Theorem by drawing sample means from non-normal population distributions.",
        "Interpret the Empirical Rule (68-95-99.7% of data within 1, 2, and 3 standard deviations of the mean).",
        "Compute Ordinary Least Squares slope (β₁), intercept (β₀), and Pearson correlation coefficient (r).",
      ]}
      applications={[
        "Biostatistics & Clinical Trial Vaccine Efficacy Testing (hypothesis testing and p-values).",
        "Financial Quantitative Risk Analysis & Value at Risk (VaR) Monte Carlo modeling.",
        "Quality Engineering & Six Sigma Manufacturing Defect Rate Control.",
        "A/B Testing and Conversion Rate Optimization in Technology Platforms.",
      ]}
      faqs={[
        {
          question: "Why is the Central Limit Theorem considered one of the most powerful theorems in statistics?",
          answer:
            "The CLT allows statisticians to make parametric inferences (such as confidence intervals and hypothesis tests) about population parameters even when the true population distribution is heavily skewed, bimodal, or unknown, provided the sample size n is sufficiently large.",
        },
        {
          question: "How does the Galton Board demonstrate the Binomial to Normal transition?",
          answer:
            "At each row of pins, a ball has an independent 50% probability (p = 0.5) of bouncing left or right. The bin a ball lands in at the bottom counts the total number of right bounces (a Binomial random variable B(n, p)). With many rows and balls, the discrete binomial histogram smooths into the continuous Gaussian bell curve.",
        },
      ]}
    />
  );
}
