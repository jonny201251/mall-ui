import React, {PureComponent} from 'react'
import {Button, Descriptions, Pagination} from 'antd'

import request from '../../utils/request'

const orderPath = '/mall/order'
const hostPath = 'http://localhost:8082/mall'

class OrderDetail extends PureComponent {
    state = {
        currentPage: 1,
        pageSize: 5
    }

    componentWillMount() {
        //获取订单id
        let orderId = this.props.location.query.orderId
        request.get(orderPath + '/queryById?orderId=' + orderId).then(res => {
            if (res && res.code === 1) {
                this.setState({orderInfo: res.data})
            }
        })
    }

    render() {
        return <span>aaa</span>
    }
}

export default OrderDetail