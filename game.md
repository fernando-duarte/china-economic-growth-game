# Open-Economy Growth Model for China (1980–2025)

## Variables

### Endogenous

| Symbol       | Definition                      | Units       |
| :----------- | :------------------------------ | :---------- |
| $Y_t$        | Real GDP                        | bn USD      |
| $K_t$        | Physical capital stock          | bn USD      |
| $L_t$        | Labor force                     | million     |
| $A_t$        | Total factor productivity (TFP) | index       |
| $X_t$        | Exports                         | bn USD      |
| $M_t$        | Imports                         | bn USD      |
| $NX_t$       | Net exports                     | bn USD      |
| $C_t$        | Consumption                     | bn USD      |
| $I_t$        | Investment                      | bn USD      |
| $openness_t$ | (Exports + Imports) / GDP       | fraction    |
| $e_t$        | Nominal exchange rate           | CNY per USD |

### Exogenous

| Symbol         | Definition                                    | Units                                 | Allowed Range        |
| :------------- | :-------------------------------------------- | :------------------------------------ | :------------------- |
| $\tilde e_t$   | Counterfactual floating nominal exchange rate | CNY per USD                           | 0.5 to 10.0          |
| $fdi\_ratio_t$ | FDI inflows \/ GDP                            | fraction                              | 0.0 to 0.1           |
| $Y^*_t$        | Foreign income                                | index (1980 = 1000)                   | 500.0 to 5000.0      |
| $H_t$          | Human capital index                           | index (2015 = Penn World Table value) | 1.0 to 10.0          |
| $G_t$          | Government spending                           | bn USD                                | -500.0 to 1500.0     |

### Parameters

| Symbol                          | Definition                                   | Units    | Value       | Allowed Range   |
| :------------------------------ | :------------------------------------------- | :------- | :---------- | :-------------- |
| $\alpha$                        | Capital share in production                  | unitless | $0.30$      | 0.1 to 0.9      |
| $\delta$                        | Depreciation rate                            | per year | $0.10$      | 0.01 to 0.2     |
| $g$                             | Baseline TFP growth rate                     | per year | $0.005$     | 0.001 to 0.05   |
| $n$                             | Labor‐force growth rate                      | per year | $0.00717$   | Fixed           |
| $\theta$                        | Openness contribution to TFP growth          | unitless | $0.1453$    | 0.01 to 0.5     |
| $\phi$                          | FDI contribution to TFP growth               | unitless | $0.10$      | 0.01 to 0.5     |
| $K_0$                           | Initial level of physical capital (1980)     | bn USD   | $2050.10$   | Fixed           |
| $X_0$                           | Initial level of exports (1980)              | bn USD   | $19.41$     | Fixed           |
| $M_0$                           | Initial level of imports (1980)              | bn USD   | $21.84$     | Fixed           |
| $L_0$                           | Initial labor force (1980)                   | millions | $428.30$    | Fixed           |
| $A_0$                           | Initial level of TFP (1980)                  | index    | $0.832$     | Fixed           |
| $\varepsilon_x,\ \varepsilon_m$ | Exchange‐rate elasticities (exports/imports) | unitless | $1.5,\ 1.2$ | 0.5 to 3.0      |
| $\mu_x,\ \mu_m$                 | Income elasticities (exports/imports)        | unitless | $1.0,\ 1.0$ | 0.5 to 2.0      |

**Note:** The initial TFP, $A_0$, is set to match the historical TFP value from 1980 data (0.832). Human capital values have been scaled by a factor of 0.1329 to ensure that the model's initial GDP in 1980 matches the historical value of 191.15 billion USD. With the original human capital values, the model's GDP would be much higher than the historical value:

$$
Y_0 = A_0 K_0^{\alpha} (L_0\,H_0)^{1-\alpha} = 0.832 \times 2050.10^{0.30} \times (428.30 \times 1.58)^{0.70} \approx 785.13
$$

With the scaled human capital value of $H_0 = 0.21$:

$$
Y_0 = 0.832 \times 2050.10^{0.30} \times (428.30 \times 0.21)^{0.70} \approx 191.18
$$

## Paths of exogenous variables

| Year | $\tilde e_t$ | $fdi\_ratio_t$ | $Y^*_t$ | $H_t$ | $G_t$ |
| ---: | -----------: | -------------: | ------: | ----: | ----: |
| 1980 |         0.78 |          0.001 | 1000.00 |  0.21 |  3.78 |
| 1985 |         1.53 |          0.001 | 1159.27 |  0.24 | −0.30 |
| 1990 |         2.48 |           0.02 | 1343.92 |  0.24 | −2.76 |
| 1995 |         4.34 |           0.02 | 1557.97 |  0.27 | 3.47 |
| 2000 |         5.23 |           0.02 | 1806.11 |  0.30 | 5.82 |
| 2005 |         4.75 |           0.02 | 2093.78 |  0.32 | −4.17 |
| 2010 |         5.61 |           0.02 | 2427.26 |  0.35 | 52.21 |
| 2015 |         7.27 |           0.02 | 2813.86 |  0.35 | −52.51 |
| 2020 |         7.00 |           0.02 | 3262.04 |  0.89 | −73.47 |
| 2025 |         6.41 |           0.02 | 3781.60 |  0.86 | −210.00 |

Values for 2025 are latest available:

- $\tilde e_t$ uses 2024 value
- $H_t$ uses 2022 value (scaled)
- $G_t$ uses 2024 value

Note: Human capital values ($H_t$) have been scaled by a factor of 0.1329 from their original values to ensure that the model's initial GDP in 1980 matches the historical value of 191.15 billion USD.

## Control Variables (Student/Player-Determined)

| Symbol | Definition           | Units                 |
| :----- | :------------------- | :-------------------- |
| $x_t$  | Exchange rate policy | 1.2, 1.0 or 0.8       |
| $s_t$  | Saving rate          | fraction (0.0 to 1.0) |

- **Exchange-rate policy**

  $$
  e_t = x_t\, \tilde e_t = \begin{cases}
    1.2\,\tilde e_t, & \text{undervalued}\\
    1.0\,\tilde e_t,      & \text{market value}\\
    0.8\,\tilde e_t, & \text{overvalued}
  \end{cases}
  $$

- **Saving-rate policy**
  $$s\in[0.0,1.0]$$

## Model Equations

- **Production:**
  $$Y_t = A_t\,K_t^{\alpha}\,(L_t\,H_t)^{1-\alpha}$$

- **Capital accumulation:**
  $$K_{t+1} = (1-\delta)\,K_t + I_t$$
  $$K_0 \text{ given}$$

- **Labor force:**
  $$L_{t+1} = (1+n) L_t$$

- **TFP:**
  $$A_{t+1} = A_t (1 + g + \theta\,openness_t + \phi\,fdi\_ratio_t)$$

- **Exports:**

  $$
    X_t = X_0\Bigl(\tfrac{e_t}{e_{1980}}\Bigr)^{\varepsilon_x}
      \Bigl(\tfrac{Y^*_t}{Y^*_{1980}}\Bigr)^{\mu_x}
  $$

- **Imports:**

  $$
    M_t = M_0\Bigl(\tfrac{e_t}{e_{1980}}\Bigr)^{-\varepsilon_m}
      \Bigl(\tfrac{Y_t}{Y_{1980}}\Bigr)^{\mu_m}
  $$

- **Net exports:**

  $$
    NX_t = X_t - M_t
  $$

  - **Saving:**
    $$S_t = Y_t - C_t = I_t + NX_t$$

- **Consumption:**
  $$C_t = (1-s)\,(Y_t - G_t)$$

- **Investment:**
  $$I_t = s\,(Y_t - G_t) - NX_t$$

- **Openness ratio:**
  $$openness_t \;=\; \frac{X_t + M_t}{Y_t}$$

- **Nominal exchange rate:**
  $$e_t = x_t\, \tilde e_t$$

## Round-by-Round Calendar

Rounds/Periods $t=0, 1, \dots$ correspond to 1980, 1985, ..., (five year intervals).
Rounds/Periods correspond to (t = 0) → 1980, (t = 1) → 1985, ... . For example:

- K*{t+1}=K_1=K*{1985} when t=0
- K*{t+1}=K_2=K*{1990} when t=1

## Computation Steps for Each Round

### Read values

1. Read values of $x_t$, $s_t$ entered by player.
2. Read values of exogenous variables $\tilde e_t$, $fdi\_ratio_t$, $Y^*_t$, $H_t$, $G_t$ from table `Paths of exogenous variables'.
3. Read values for $K_t$, $L_t$, $A_t$:

- For first round (1980), $K_0$, $L_0$, $A_0$ given by parameter values
- For second and later rounds (1985, 1990, ...), $K_t$, $L_t$, $A_t$ determined in the previous round

### Compute current period variable values

4. Compute output/production:
   $$ Y_t = A_t K_t^{\alpha} (L_t\,H_t)^{1-\alpha} $$
5. Compute nominal exchange rate:
   $$ e_t = x_t \tilde e_t $$
6. Compute exports:
   $$
     X_t = X_0\Bigl(\tfrac{e_t}{e_{0}}\Bigr)^{\varepsilon_x}
       \Bigl(\tfrac{Y^*_t}{Y^*_{0}}\Bigr)^{\mu_x}.
   $$
7. Compute imports:
   $$
     M_t = M_0\Bigl(\tfrac{e_t}{e_{0}}\Bigr)^{-\varepsilon_m}
       \Bigl(\tfrac{Y_t}{Y_{0}}\Bigr)^{\mu_m}.
   $$
   where $Y_0$ is the model-implied GDP in 1980 (not the historical value).
8. Compute net exports:
   $$ NX_t = X_t - M_t $$
9. Compute openness ratio:
   $$
     openness_t = \frac{X_t + M_t}{Y_t}
   $$
10. Compute consumption:
    $$ C_t = (1-s) (Y_t - G_t) $$

11. Compute investment:
    $$ I_t = s (Y_t - G_t) - NX_t $$

### Compute next period's variable values

12. Compute next period's labor force:
    $$ L\_{t+1} = (1+n) L_t $$

13. Compute next period's capital:
    $$ K\_{t+1} = (1-\delta) K_t + I_t $$

14. Compute next period's TFP:
    $$
      A_{t+1} = A_t
        (1 + g
          + \theta\,openness_t
          + \phi\,fdi\_ratio_t
        )
    $$

# China Economic Data (1980–2024)

::: {.landscape}

| Year | Exports (bn USD) | Imports (bn USD) | GDP (bn USD) | Capital Stock (2017 USD bn) | Labor Force (million) | Human Capital Index | TFP (2017 = 1) | Consumption (bn USD) | Investment (bn USD) | Government Spending (bn USD) | Saving Rate | FX Rate (CNY/USD) | Counterfactual Floating Nominal Rate (CNY/USD) |
| ---: | ---------------: | ---------------: | -----------: | --------------------------: | --------------------: | ------------------: | -------------: | -------------------: | ------------------: | ---------------------------: | ----------: | ----------------: | ---------------------------------------------: |
| 1980 |            19.41 |            21.84 |       191.15 |                     2050.10 |                428.30 |                1.58 |          0.832 |               123.65 |               66.15 |                         3.78 |        0.34 |              1.50 |                                           0.78 |
| 1985 |            25.80 |            38.30 |       309.49 |                     3062.30 |                496.80 |                1.77 |          0.878 |               201.39 |              120.90 |                        −0.30 |        0.35 |              2.94 |                                           1.53 |
| 1990 |            49.13 |            38.46 |       360.85 |                     4507.30 |                550.80 |                1.80 |          0.805 |               229.68 |              123.26 |                        −2.76 |        0.37 |              4.78 |                                           2.48 |
| 1995 |           131.86 |           119.90 |       734.55 |                     7287.10 |                629.00 |                2.02 |          0.869 |               433.84 |              285.28 |                         3.47 |        0.41 |              8.35 |                                           4.34 |
| 2000 |           253.09 |           224.31 |      1211.35 |                    12185.20 |                679.50 |                2.24 |          0.810 |               770.06 |              406.69 |                         5.82 |        0.36 |              8.28 |                                           5.23 |
| 2005 |           773.34 |           648.71 |      2285.97 |                    21265.50 |                748.70 |                2.43 |          0.895 |              1243.21 |              922.30 |                        −4.17 |        0.46 |              8.19 |                                           4.75 |
| 2010 |          1654.82 |          1432.42 |      6086.00 |                    39311.20 |                783.00 |                2.61 |          1.031 |              2977.44 |             2833.95 |                        52.21 |        0.51 |              6.77 |                                           5.61 |
| 2015 |          2362.10 |          2003.26 |     11061.00 |                    68791.70 |                797.00 |                2.60 |          1.019 |              5972.23 |             4782.44 |                       −52.51 |        0.46 |              6.23 |                                           7.27 |
| 2020 |          2729.88 |          2374.74 |     14723.00 |                   100000.00 |                787.10 |                6.71 |          0.936 |              8071.33 |             6370.00 |                       −73.47 |        0.45 |              6.90 |                                           7.00 |
| 2021 |          3554.11 |          3093.28 |     17734.10 |                   102500.00 |                786.00 |                6.52 |          0.951 |              9420.00 |             6840.00 |                      1013.27 |        0.44 |              6.45 |                                           7.21 |
| 2022 |          3717.89 |          3140.04 |     17882.00 |                   105000.00 |                783.00 |                6.49 |          0.961 |             10000.00 |             7520.00 |                      −215.85 |        0.45 |              6.73 |                                           7.15 |
| 2023 |          3513.24 |          3127.20 |     18273.00 |                   107500.00 |                780.00 |                 n/a |          0.971 |             10500.00 |             7270.00 |                       116.96 |        0.42 |              7.07 |                                           6.57 |
| 2024 |          3580.00 |          2590.00 |     19530.00 |                   110000.00 |                778.00 |                 n/a |          0.979 |             11250.00 |             7500.00 |                      −210.00 |        0.43 |              7.00 |                                           6.41 |

:::
