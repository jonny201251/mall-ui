import React, {PureComponent} from 'react'
import {Button, message, Steps} from 'antd'
import stepStyles from './step.less'
import Form1 from '../Form1/Form1'

const {Step} = Steps
export default class ItemAdd extends PureComponent {
    state = {
        current: 0
    }

    next() {
        if (this.state.current === 0) {
            console.log(this.Form1.core);
            this.Form1.core.validate((err) => {
                console.log(err)
            })
            return
        } else if (this.state.current === 1) {

        }
        const current = this.state.current + 1;
        this.setState({current});
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    onRef = (ref) => {
        this.Form1 = ref
    }

    render() {
        let steps = [
            {
                title: '商品类目',
                content: <Form1 onRef={this.onRef}/>,
            },
            {
                title: '商品信息',
                content: 'Second-content',
            },
            {
                title: '具体的商品',
                content: 'Last-content',
            },
        ]
        const {current} = this.state;
        return (
            <div>
                <Steps current={current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title}/>
                    ))}
                </Steps>
                <div className={stepStyles.stepsContent}>{steps[current].content}</div>
                <div className={stepStyles.stepsAction}>
                    {current > 0 && (
                        <Button style={{marginRight: 8}} onClick={() => this.prev()}>
                            上一步
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => this.next()}>
                            下一步
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            发布
                        </Button>
                    )}
                </div>
            </div>
        )
    }
}