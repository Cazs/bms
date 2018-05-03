// Helpers
import Log from '../app/helpers/Logger';

export const getQuoteItemTotal = (item) => 
{
  let extra_costs_total = 0;
  if(item.extra_costs)
    item.extra_costs.map((cost) => extra_costs_total += Number(cost.cost) + (Number(cost.cost) * Number(cost.markup)/100));

  Log('verbose_info', 'current quote item\'s extra costs total: ' + extra_costs_total);
                    
  const quantity = Number(item.quantity);
  const markup_cost = Number(Number(item.unit_cost) * Number(item.markup)/100);
  const markedup_unit_cost = Number(Number(item.unit_cost) + markup_cost);

  // rate = marked up unit cost + extra cost total
  const quote_item_rate = Number(Number(markedup_unit_cost) + Number(extra_costs_total));
  
  Log('verbose_info', 'current quote item\'s new rate: ' + quote_item_rate);
  
  // total = rate * quantity
  const quote_item_total = Number(Number(quote_item_rate) * Number(quantity));
  Log('verbose_info', 'current quote item total: ' + quote_item_total);

  return quote_item_total;
}