function computeQuoteData(data)
{
  // TODO: update this
  function calSub(data) {
    return data.rows.reduce((value, row) => value + row.subtotal, 0);
  }

  function calTax(data)
  {
    if (data.vat)
    {
      const subtotal = calSub(data);
      return subtotal * data.vat / 100;
    }
  }

  function calTotal()
  {
    let grandTotal = calSub(data);

    if (data.vat)
    {
      const taxAmount = calTax(data);

      grandTotal += taxAmount;
    }
    return grandTotal;
  }

  return {
    subtotal: calSub(data),
    taxAmount: calTax(data),
    grandTotal: calTotal()
  };
}

export { computeQuoteData };
