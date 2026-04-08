export default function calcDiscount(totalAmount, totalQuantity) {
    let discount = 0

    const discountPairs = Math.floor(totalQuantity / 2);
    const discountItems = discountPairs * 2;

    if(discountItems > 0) {
        
        const averagePrice = totalAmount / totalQuantity
        const discountAmount = averagePrice * discountItems
        discount = discountAmount * 0.20
    }

    return discount
}