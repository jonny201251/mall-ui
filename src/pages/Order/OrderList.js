import React, {PureComponent} from 'react'
import {Table, Divider, Tag, Button} from 'antd';

import request from '../../utils/request'

let globalList
const orderPath = '/mall/order'

class OrderList extends PureComponent {
    state = {
        currentPage: 1,
        pageSize: 5
    }

    componentWillMount() {
        //获取订单
        request.get(orderPath + '/orderList?currentPage=' + this.state.currentPage + "&pageSize=" + this.state.pageSize).then(res => {
            if (res && res.code === 1) {
                this.setState({orderList: res.data})
            }
        })
    }

    showOrder = () => {
        return <span>aaaaaa</span>
    }

    render() {
        return (
            <div>
                {this.state.orderList ? this.showOrder() : ''}
            </div>
        )
    }
}

export default OrderList