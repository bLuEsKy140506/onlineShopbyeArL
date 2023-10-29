import InitiatorAndConvertList from "./InitiatorAndConvertList";

export default async function InitiatorPathAndExchangeRate() {
  //THIS DATA IS STATIC BECAUSE THE API HAS LIMITED USAGE/CONSUMPTION FOR FREE USERS
  //SO I DECIDED TO TAKE THE LATEST DATA THEN MANUALLY INPUT HERE
  /*
 {
  "success": true,
  "timestamp": 1698584583,
  "base": "EUR",
  "date": "2023-10-29",
  "rates": {
    "USD": 1.057861,
    "AUD": 1.669867,
    "CAD": 1.468364,
    "PLN": 4.469122,
    "MXN": 19.163361,
    "PHP": 60.30127
  }
}
}
  
  */
  const presetCurrency = {
    USD: 1.057861,
    AUD: 1.669867,
    CAD: 1.468364,
    PLN: 4.469122,
    MXN: 19.163361,
    PHP: 60.30127,
    EUR: 1,
  };

  // const presetCurrency = data.rates;

  return (
    <>
      <div className="filter-section">
        <InitiatorAndConvertList data={presetCurrency} />
        {/* <ConvertList1 data={presetCurrency} /> */}
      </div>
    </>
  );
}

// async function getData() {
//   const res = await fetch(
//     "http://data.fixer.io/api/latest?access_key=705ba7415f31dde1c5a4e82c1bc453e9&symbols=USD,PHP,AUD,CAD,PLN,MXN,EUR&format=1"
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }
//   return res.json();
// }
