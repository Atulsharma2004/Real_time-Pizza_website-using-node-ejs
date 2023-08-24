import moment from "moment";
import axios from "axios";
import Noty from "noty";

export function initAdmin(socket) {
    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = []

    let markup;

    axios.get('/admin/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data;
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup;
    }).catch(err => {
        console.log(err)
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p> ${menuItem.item.name} - ${menuItem.qty} pcs </p>
            `
        }).join('')
    }

    function generateMarkup(orders) {
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900" >
                    <p>${order._id}</p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td class="border px-4 py-2">${order.customerId.name}</td>
                <td class="border px-4 py-2">${order.address}</td> 
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${order._id}">
                            <select id="" name="status" onchange='this.form.submit()' class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>Placed</option>
                                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>Prepared</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </form>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class=" border px-4 py-2">
                    ${moment(order.createdAt).format('HH:mm A')}
                </td>
                </tr>
            `

        }).join('')
    }


    // let socket=io();
    socket.on('orderPlaced', (order) => {
        new Noty({
            type: 'success',
            timeout: 1000,
            text: "New Order"
        }).show();

        orders.unshift(order)
        orderTableBody.innerHTML = '';
        orderTableBody.innerHTML = generateMarkup(orders)
    })


}