import { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { navigations } from "./navigation.data";
import { Link, Tooltip } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { connectToMetaMask } from "../../store/wallet/actions";
import { getFiatBalance, getFormattedBalance } from "../../utils/metamask";

type NavigationData = {
  path: string;
  label: string;
};

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr.", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "AED", symbol: "د.إ", name: "United Arab Emirates Dirham" },
  { code: "SAR", symbol: "ر.س", name: "Saudi Riyal" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "CLP", symbol: "$", name: "Chilean Peso" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "EGP", symbol: "ج.م", name: "Egyptian Pound" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
];

const Navigation: FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useAppDispatch();
  const [fiatBalance, setFiatBalance] = useState<String>("");
  const { account, chainId, isLoading, error, accountBalance } = useAppSelector(
    (state) => state.metaMaskWallet
  );
  const [currency, setCurrency] = useState("USD");

  const fetchAccordingToCurrency = async () => {
    const fiatBalance = await getFiatBalance(accountBalance, currency);
    setFiatBalance(String(fiatBalance));
  };

  useEffect(() => {
    if (accountBalance !== null && fiatBalance === "") {
      fetchAccordingToCurrency();
    }
  }, [accountBalance, currency]);

  const handleCurrencyChange = (event: any) => {
    setCurrency(event.target.value);
    fetchAccordingToCurrency();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "wrap",
        justifyContent: "end",
        flexDirection: { xs: "column", lg: "row" },
      }}
    >
      {navigations.map(({ path: destination, label }: NavigationData) => (
        <Box
          key={label}
          component={Link}
          href={destination}
          sx={{
            display: "inline-flex",
            position: "relative",
            color: currentPath === destination ? "" : "white",
            lineHeight: "30px",
            letterSpacing: "3px",
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "uppercase",
            fontWeight: 700,
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 0, lg: 3 },
            mb: { xs: 3, lg: 0 },
            fontSize: "20px",
            ...(destination === "/" && { color: "primary.main" }),
            "& > div": { display: "none" },
            "&.current>div": { display: "block" },
            "&:hover": {
              color: "text.disabled",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 12,
              transform: "rotate(3deg)",
              "& img": { width: 44, height: "auto" },
            }}
          >
            {/* eslint-disable-next-line */}
            <img src="/images/headline-curve.svg" alt="Headline curve" />
          </Box>
          {label}
        </Box>
      ))}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {account ? (
        <Tooltip
          title={
            <div>
              <p>Connected Account: {account}</p>
              <p>Chain ID: {String(chainId)}</p>
            </div>
          }
        >
          <Box
            sx={{
              position: "relative",
              color: "white",
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: 600,
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 0, lg: 3 },
              mb: { xs: 3, lg: 0 },
              borderRadius: "6px",
              backgroundColor: "#00dbe3",
              padding: 1,
            }}
          >
            Connected
            <div style={{ fontSize: 12, paddingTop: 2 }}>
              {" "}
              {String(getFormattedBalance(accountBalance))} ETH ( {fiatBalance}{" "}
              <select
                value={currency}
                onChange={handleCurrencyChange}
                style={{
                  background: "transparent",
                  border: 0,
                  width: 42,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {currencies.map((currencyOption) => (
                  <option key={currencyOption.code} value={currencyOption.code}>
                    {currencyOption.symbol}{" "}
                    {currencyOption.code === currency &&
                      currencyOption.symbol.length < 3 &&
                      currencyOption.code}{" "}
                    {currencyOption.code !== currency && currencyOption.name}
                  </option>
                ))}
              </select>
              )
            </div>
          </Box>
        </Tooltip>
      ) : (
        <Box
          onClick={() => dispatch(connectToMetaMask())}
          sx={{
            position: "relative",
            color: "white",
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "uppercase",
            fontWeight: 600,
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 0, lg: 3 },
            mb: { xs: 3, lg: 0 },
            fontSize: "24px",
            width: "324px",
            height: "45px",
            borderRadius: "6px",
            backgroundColor: "#00dbe3",
          }}
        >
          Connect Wallet
          <div style={{ fontSize: 10, paddingTop: 2 }}>
            {isLoading && "Loading..."}
          </div>
        </Box>
      )}
    </Box>
  );
};

export default Navigation;
