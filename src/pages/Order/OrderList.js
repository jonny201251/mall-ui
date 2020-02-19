import React, {PureComponent} from 'react'
import {Button, Descriptions, Pagination} from 'antd'
import router from 'umi/router'
import Link from 'umi/link'

import request from '../../utils/request'

const orderPath = '/mall/order'
const hostPath = 'http://localhost:8082/mall'

class OrderList extends PureComponent {
    state = {
        currentPage: 1,
        pageSize: 5
    }

    getOrderData = (currentPage) => {
        request.get(orderPath + '/orderList?currentPage=' + currentPage + "&pageSize=" + this.state.pageSize).then(res => {
            if (res && res.code === 1) {
                this.setState({orderData: res.data})
            }
        })
    }

    componentWillMount() {
        //获取订单
        this.getOrderData(this.state.currentPage)
    }

    onClick = (orderId) => {
        request.get(orderPath + '/orderCancel?orderId=' + orderId).then(res => {
            if (res && res.code === 1) {
                //重新获取订单
                this.getOrderData(this.state.currentPage)
            }
        })
    }
    orderStatus = (status) => {
        let statusInfo = ''
        if (status === 0) {
            statusInfo = '暂不付款'
        } else if (status === 7) {
            statusInfo = '取消订单'
        } else {
            statusInfo = '交易关闭'
        }
        return statusInfo
    }
    showOrder = () => {
        if (this.state.orderData) {
            let count = 0
            return this.state.orderData.dataList.map(order => {
                if (count === 0) {
                    count++
                    return <div style={{border: '1px solid #e8e8e8'}}>
                        <div style={{height: 32, background: '#f5f5f5', color: '#aaa'}}>
                            <span style={{paddingLeft: 15}}>订单编号：{order.orderId}</span>
                            <span style={{paddingLeft: 15}}>下单时间：{order.createTime}</span>
                            <span style={{paddingLeft: 15}}>订单总额：￥{order.totalPay}</span>
                            <span style={{paddingLeft: 15}}>状态：{this.orderStatus(order.orderStatus.status)}</span>
                            <Link to={"/orderDetail?orderId=" + order.orderId} style={{paddingLeft: 15}}>查看订单</Link>
                            {
                                order.orderStatus.status !== 7 ?
                                    <Button type="link" size="small" style={{paddingLeft: 5}}
                                            onClick={() => this.onClick(order.orderId)}>取消订单</Button>
                                    : ''
                            }
                        </div>
                        <Descriptions size="small" column={6}>
                            {this.showItem(order.orderDetails)}
                        </Descriptions>
                    </div>
                } else {
                    return <div style={{marginTop: 5, border: '1px solid #e8e8e8'}}>
                        <div style={{height: 32, background: '#f5f5f5', color: '#aaa'}}>
                            <span style={{paddingLeft: 15}}>订单编号：{order.orderId}</span>
                            <span style={{paddingLeft: 15}}>下单时间：{order.createTime}</span>
                            <span style={{paddingLeft: 15}}>订单总额：￥{order.totalPay}</span>
                            <span style={{paddingLeft: 15}}>状态：{this.orderStatus(order.orderStatus.status)}</span>
                            <Link to={"/orderDetail?orderId=" + order.orderId} style={{paddingLeft: 15}}>查看订单</Link>
                            {
                                order.orderStatus.status !== 7 ?
                                    <Button type="link" size="small" style={{paddingLeft: 5}}
                                            onClick={() => this.onClick(order.orderId)}>取消订单</Button>
                                    : ''
                            }
                        </div>
                        <Descriptions size="small" column={6}>
                            {this.showItem(order.orderDetails)}
                        </Descriptions>
                    </div>
                }
            })
        }
    }

    showItem = (items) => {
        let arr = []
        arr.push(<Descriptions.Item span={4}><span style={{paddingLeft: 15}}>商品信息</span></Descriptions.Item>)
        arr.push(<Descriptions.Item>{"价格"}</Descriptions.Item>)
        arr.push(<Descriptions.Item>{"数量"}</Descriptions.Item>)
        items.map(item => {
            arr.push(<Descriptions.Item span={4}>
                <img src={item.image} width="60px" height="60px"/>
                {<a target="_blank" href={hostPath + '/item.html?id=' + item.id}>{item.title}</a>}
            </Descriptions.Item>)
            arr.push(<Descriptions.Item>{item.price}</Descriptions.Item>)
            arr.push(<Descriptions.Item>{item.num}</Descriptions.Item>)
        })
        return arr
    }

    onChange = (currentPage) => {
        this.setState({currentPage})
        this.getOrderData(currentPage)
    }
    showPagination = () => {
        if (this.state.orderData) {
            let total = this.state.orderData.totalPage
            return <div style={{marginTop: 7, float: 'right'}}>
                <Pagination showQuickJumper defaultCurrent={this.state.currentPage}
                            pageSize={this.state.pageSize}
                            total={this.state.orderData.total}
                            showTotal={total => `共${total}条`}
                            onChange={this.onChange}/>
            </div>

        }
    }

    render() {
        return (
            <div>
                {this.state.orderData ? this.showOrder() : ''}
                {this.state.orderData ? this.showPagination() : ''}
            </div>
        )
    }
}

export default OrderList