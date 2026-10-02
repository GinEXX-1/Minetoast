import {sceneSchema} from '../../packages/ponder/src/schema';
export const expansionScenes=[
sceneSchema.parse({
  "id": "quadratic-parameter",
  "version": 1,
  "dslVersion": 1,
  "nodeId": "HS-FUNC-QUAD-001",
  "title": "二次函数参数变化",
  "renderer": "coordinate",
  "pedagogy": {
    "primary": "PARAMETER_PATTERN"
  },
  "duration": 34,
  "scene": {
    "xRange": [
      -3,
      3
    ],
    "yRange": [
      -10,
      10
    ]
  },
  "parameters": {
    "a": {
      "min": -3,
      "max": 3,
      "default": 1,
      "label": "参数 a",
      "step": 0.01
    }
  },
  "expressions": {
    "f": "a*x^2"
  },
  "objects": [
    {
      "id": "curve",
      "kind": "plot",
      "label": "y=ax²",
      "color": "cyan",
      "expression": "a*x^2",
      "domain": [
        -2,
        2
      ]
    },
    {
      "id": "vertex",
      "kind": "point",
      "label": "O",
      "color": "gold",
      "at": [
        "0",
        "0"
      ]
    }
  ],
  "steps": [
    {
      "id": "observe",
      "title": "观察抛物线",
      "caption": "先观察 a=1 时的图像。",
      "semanticLabel": "先观察 a=1 时的图像。",
      "duration": 8,
      "show": [
        "curve",
        "vertex"
      ],
      "cues": [
        {
          "target": "curve",
          "kind": "draw",
          "start": 0.0,
          "duration": 1.25
        },
        {
          "target": "vertex",
          "kind": "reveal",
          "start": 0.45,
          "duration": 0.85
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "change",
      "title": "改变开口",
      "caption": "连续改变 a，观察开口方向和图像宽窄。",
      "semanticLabel": "连续改变 a，观察开口方向和图像宽窄。",
      "duration": 10,
      "show": [
        "curve",
        "vertex"
      ],
      "animate": [
        {
          "parameter": "a",
          "from": 1,
          "to": -2,
          "start": 2,
          "duration": 7,
          "easing": "smooth"
        }
      ],
      "cues": [
        {
          "target": "curve",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "vertex",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "interact",
      "title": "自己改变参数",
      "caption": "拖动 a。当 a=0 时，图像退化为直线 y=0。",
      "semanticLabel": "拖动 a。当 a=0 时，图像退化为直线 y=0。",
      "duration": 8,
      "show": [
        "curve",
        "vertex"
      ],
      "interaction": [
        "a"
      ],
      "cues": [
        {
          "target": "curve",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "vertex",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0,
        "formulaAt": 0
      }
    },
    {
      "id": "symbolic",
      "title": "参数的意义",
      "caption": "a 的符号决定开口方向；|a| 越大，图像越窄。",
      "semanticLabel": "当 a>0 时开口向上，a<0 时向下。顶点恒为原点。固定非零 x 时 |y|=|a|x²；a=0 不再是二次函数。",
      "duration": 8,
      "show": [
        "curve",
        "vertex"
      ],
      "formula": "y=ax^2,\\quad a\\ne0",
      "cues": [
        {
          "target": "curve",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "vertex",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 2.5
      }
    }
  ],
  "controls": {
    "supportsScrub": false,
    "allowCameraRotation": true
  },
  "completion": {
    "principleViewed": true
  },
  "textbook": {
    "sourceRef": "PEP-A:B1:C3:S3.2",
    "scope": "二次函数 y=ax² 的开口与宽窄；明确 a=0 是退化情形。"
  }
}),
sceneSchema.parse({
  "id": "function-zeros",
  "readouts": [
    {
      "id": "output",
      "label": "f(x)",
      "expression": "f(t)"
    }
  ],
  "version": 1,
  "dslVersion": 1,
  "nodeId": "HS-FUNC-ZERO-001",
  "title": "零点与横轴交点",
  "renderer": "coordinate",
  "pedagogy": {
    "primary": "OBSERVE_PATTERN"
  },
  "duration": 34,
  "scene": {
    "xRange": [
      -3.5,
      3.5
    ],
    "yRange": [
      -5,
      6
    ]
  },
  "parameters": {
    "t": {
      "min": -3,
      "max": 3,
      "default": -3,
      "label": "自变量 x",
      "step": 0.01
    }
  },
  "expressions": {
    "f": "x^2-4"
  },
  "objects": [
    {
      "id": "curve",
      "kind": "plot",
      "label": "f(x)=x²−4",
      "color": "cyan",
      "expression": "f(x)",
      "domain": [
        -3,
        3
      ]
    },
    {
      "id": "moving",
      "kind": "point",
      "label": "(x,f(x))",
      "color": "gold",
      "at": [
        "t",
        "f(t)"
      ],
      "draggable": "t"
    },
    {
      "id": "zeroLeft",
      "kind": "point",
      "label": "(−2,0)",
      "color": "green",
      "at": [
        "-2",
        "0"
      ]
    },
    {
      "id": "zeroRight",
      "kind": "point",
      "label": "(2,0)",
      "color": "green",
      "at": [
        "2",
        "0"
      ]
    }
  ],
  "steps": [
    {
      "id": "observe",
      "title": "观察曲线",
      "caption": "观察 f(x)=x²−4 与横轴的关系。",
      "semanticLabel": "观察 f(x)=x²−4 与横轴的关系。",
      "duration": 8,
      "show": [
        "curve"
      ],
      "cues": [
        {
          "target": "curve",
          "kind": "draw",
          "start": 0.0,
          "duration": 1.25
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "cross",
      "title": "函数值归零",
      "caption": "点沿曲线运动，在横轴处函数值为零。",
      "semanticLabel": "点沿曲线运动，在横轴处函数值为零。",
      "duration": 10,
      "show": [
        "curve",
        "moving"
      ],
      "animate": [
        {
          "parameter": "t",
          "from": -3,
          "to": 3,
          "start": 2,
          "duration": 7,
          "easing": "smooth"
        }
      ],
      "cues": [
        {
          "target": "moving",
          "kind": "reveal",
          "start": 0.0,
          "duration": 0.85
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "interact",
      "readouts": [
        "output"
      ],
      "title": "寻找两个位置",
      "caption": "移动 x，观察点何时到达横轴。",
      "semanticLabel": "移动 x，观察点何时到达横轴。",
      "duration": 8,
      "show": [
        "curve",
        "moving",
        "zeroLeft",
        "zeroRight"
      ],
      "interaction": [
        "t"
      ],
      "cues": [
        {
          "target": "zeroLeft",
          "kind": "reveal",
          "start": 0.0,
          "duration": 0.85
        },
        {
          "target": "zeroRight",
          "kind": "reveal",
          "start": 0.45,
          "duration": 0.85
        }
      ],
      "narration": {
        "captionAt": 0,
        "formulaAt": 0
      }
    },
    {
      "id": "symbolic",
      "title": "零点是实数",
      "caption": "零点是横坐标 −2 与 2；交点是两个坐标点。",
      "semanticLabel": "零点是横坐标 −2 与 2；交点是两个坐标点。",
      "duration": 8,
      "show": [
        "curve",
        "zeroLeft",
        "zeroRight"
      ],
      "formula": "f(x)=0\\iff x^2-4=0\\iff x=\\pm2",
      "cues": [
        {
          "target": "zeroLeft",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "zeroRight",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 2.5
      }
    }
  ],
  "controls": {
    "supportsScrub": false,
    "allowCameraRotation": true
  },
  "completion": {
    "principleViewed": true
  },
  "textbook": {
    "sourceRef": "PEP-A:B1:C4:S4.5",
    "scope": "区分函数零点与图像交点；零点为实数输入。"
  }
}),
sceneSchema.parse({
  "id": "linear-slope",
  "version": 1,
  "dslVersion": 1,
  "nodeId": "HS-FUNC-LINEAR-001",
  "title": "斜率与变化方向",
  "renderer": "coordinate",
  "pedagogy": {
    "primary": "PARAMETER_PATTERN"
  },
  "duration": 34,
  "scene": {
    "xRange": [
      -3.5,
      3.5
    ],
    "yRange": [
      -6,
      7
    ]
  },
  "parameters": {
    "k": {
      "min": -3,
      "max": 3,
      "default": 1,
      "label": "斜率 k",
      "step": 0.01
    }
  },
  "expressions": {
    "f": "k*x+1"
  },
  "objects": [
    {
      "id": "curve",
      "kind": "plot",
      "label": "y=kx+1",
      "color": "cyan",
      "expression": "k*x+1",
      "domain": [
        -3,
        3
      ]
    },
    {
      "id": "intercept",
      "kind": "point",
      "label": "(0,1)",
      "color": "gold",
      "at": [
        "0",
        "1"
      ]
    }
  ],
  "steps": [
    {
      "id": "observe",
      "title": "观察直线",
      "caption": "直线穿过固定点 (0,1)。",
      "semanticLabel": "直线穿过固定点 (0,1)。",
      "duration": 8,
      "show": [
        "curve",
        "intercept"
      ],
      "cues": [
        {
          "target": "curve",
          "kind": "draw",
          "start": 0.0,
          "duration": 1.25
        },
        {
          "target": "intercept",
          "kind": "reveal",
          "start": 0.45,
          "duration": 0.85
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "change",
      "title": "改变斜率",
      "caption": "k 改变时，直线绕这个点旋转。",
      "semanticLabel": "k 改变时，直线绕这个点旋转。",
      "duration": 10,
      "show": [
        "curve",
        "intercept"
      ],
      "animate": [
        {
          "parameter": "k",
          "from": 1,
          "to": -2,
          "start": 2,
          "duration": 7,
          "easing": "smooth"
        }
      ],
      "cues": [
        {
          "target": "curve",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "intercept",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "interact",
      "title": "比较变化方向",
      "caption": "改变 k，观察从左向右的变化方向。",
      "semanticLabel": "改变 k，观察从左向右的变化方向。",
      "duration": 8,
      "show": [
        "curve",
        "intercept"
      ],
      "interaction": [
        "k"
      ],
      "cues": [
        {
          "target": "curve",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "intercept",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0,
        "formulaAt": 0
      }
    },
    {
      "id": "symbolic",
      "title": "斜率的意义",
      "caption": "k>0 时递增，k<0 时递减；k=0 时为常数函数。",
      "semanticLabel": "y=kx+1 的纵截距不随 k 变化。当 k≠0 为一次函数，k=0 为常数函数；固定 Δx>0 后 Δy 的符号由 k 决定。",
      "duration": 8,
      "show": [
        "curve",
        "intercept"
      ],
      "formula": "\\Delta y=k\\Delta x",
      "cues": [
        {
          "target": "curve",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "intercept",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 2.5
      }
    }
  ],
  "controls": {
    "supportsScrub": false,
    "allowCameraRotation": true
  },
  "completion": {
    "principleViewed": true
  },
  "textbook": {
    "sourceRef": "PEP-A:B1:C3:S3.2",
    "scope": "一次函数斜率的符号与单调方向；明确 k=0 的特殊情形。"
  }
}),
sceneSchema.parse({
  "id": "unit-circle",
  "readouts": [
    {
      "id": "cosine",
      "label": "cos φ",
      "expression": "cos(phi)"
    },
    {
      "id": "sine",
      "label": "sin φ",
      "expression": "sin(phi)"
    }
  ],
  "version": 1,
  "dslVersion": 1,
  "nodeId": "HS-TRIG-UNIT-CIRCLE-001",
  "title": "单位圆与坐标",
  "renderer": "geometry",
  "pedagogy": {
    "primary": "INVARIANT_PATTERN"
  },
  "duration": 34,
  "scene": {
    "axes": true,
    "xRange": [
      -1.8,
      1.8
    ],
    "yRange": [
      -1.8,
      1.8
    ]
  },
  "parameters": {
    "phi": {
      "min": -3.14159,
      "max": 3.14159,
      "default": 0.4,
      "label": "角度 φ（弧度）",
      "step": 0.01
    }
  },
  "expressions": {},
  "objects": [
    {
      "id": "circle",
      "kind": "circle",
      "label": "单位圆",
      "color": "cyan",
      "center": [
        "0",
        "0"
      ],
      "radius": "1"
    },
    {
      "id": "O",
      "kind": "point",
      "label": "O",
      "color": "muted",
      "at": [
        "0",
        "0"
      ]
    },
    {
      "id": "P",
      "kind": "point",
      "label": "P",
      "color": "gold",
      "at": [
        "cos(phi)",
        "sin(phi)"
      ],
      "draggable": "phi"
    },
    {
      "id": "radius",
      "kind": "segment",
      "label": "",
      "color": "gold",
      "from": [
        "0",
        "0"
      ],
      "to": [
        "cos(phi)",
        "sin(phi)"
      ]
    },
    {
      "id": "projection",
      "kind": "segment",
      "label": "",
      "color": "green",
      "from": [
        "cos(phi)",
        "0"
      ],
      "to": [
        "cos(phi)",
        "sin(phi)"
      ],
      "dashed": true
    }
  ],
  "steps": [
    {
      "id": "observe",
      "title": "观察单位圆",
      "caption": "圆心在原点，半径等于 1。",
      "semanticLabel": "圆心在原点，半径等于 1。",
      "duration": 8,
      "show": [
        "circle",
        "O",
        "P",
        "radius"
      ],
      "cues": [
        {
          "target": "circle",
          "kind": "draw",
          "start": 0.0,
          "duration": 1.25
        },
        {
          "target": "O",
          "kind": "reveal",
          "start": 0.45,
          "duration": 0.85
        },
        {
          "target": "P",
          "kind": "reveal",
          "start": 0.9,
          "duration": 0.85
        },
        {
          "target": "radius",
          "kind": "draw",
          "start": 1.35,
          "duration": 0.85
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "rotate",
      "title": "沿圆周运动",
      "caption": "P 沿圆周运动，半径始终保持为 1。",
      "semanticLabel": "P 沿圆周运动，半径始终保持为 1。",
      "duration": 10,
      "show": [
        "circle",
        "O",
        "P",
        "radius",
        "projection"
      ],
      "animate": [
        {
          "parameter": "phi",
          "from": 0.4,
          "to": 2.6,
          "start": 2,
          "duration": 7,
          "easing": "smooth"
        }
      ],
      "cues": [
        {
          "target": "projection",
          "kind": "draw",
          "start": 0.0,
          "duration": 0.85
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "interact",
      "readouts": [
        "cosine",
        "sine"
      ],
      "title": "自由观察",
      "caption": "改变角度，观察点的横坐标与纵坐标。",
      "semanticLabel": "改变角度，观察点的横坐标与纵坐标。",
      "duration": 8,
      "show": [
        "circle",
        "O",
        "P",
        "radius",
        "projection"
      ],
      "interaction": [
        "phi"
      ],
      "cues": [
        {
          "target": "radius",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "projection",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0,
        "formulaAt": 0
      }
    },
    {
      "id": "symbolic",
      "title": "坐标的关系",
      "caption": "P 的坐标是 (cos φ,sin φ)，始终满足这个等式。",
      "semanticLabel": "P 的坐标是 (cos φ,sin φ)，始终满足这个等式。",
      "duration": 8,
      "show": [
        "circle",
        "O",
        "P",
        "radius",
        "projection"
      ],
      "formula": "\\cos^2\\varphi+\\sin^2\\varphi=1",
      "cues": [
        {
          "target": "radius",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "projection",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 2.5
      }
    }
  ],
  "controls": {
    "supportsScrub": false,
    "allowCameraRotation": true
  },
  "completion": {
    "principleViewed": true
  },
  "textbook": {
    "sourceRef": "PEP-A:B1:C5:S5.2",
    "scope": "单位圆点坐标与正弦余弦关系，不扩展到超出节点定义的推导。"
  }
}),
sceneSchema.parse({
  "id": "derivative-tangent",
  "readouts": [
    {
      "id": "secantSlope",
      "label": "割线斜率",
      "expression": "(f(x0+h)-f(x0))/h"
    },
    {
      "id": "tangentSlope",
      "label": "切线斜率",
      "expression": "2*x0"
    }
  ],
  "version": 1,
  "dslVersion": 1,
  "nodeId": "HS-CALC-TANGENT-SLOPE-001",
  "title": "导数与切线",
  "renderer": "coordinate",
  "pedagogy": {
    "primary": "DERIVE_PATTERN"
  },
  "duration": 34,
  "scene": {
    "xRange": [
      -3.5,
      3.5
    ],
    "yRange": [
      -1,
      10
    ]
  },
  "parameters": {
    "x0": {
      "min": -1.5,
      "max": 1.5,
      "default": 0.8,
      "label": "切点横坐标 x₀",
      "step": 0.01
    },
    "h": {
      "min": 0.05,
      "max": 1.5,
      "default": 1.5,
      "label": "两点横坐标差 h",
      "step": 0.01
    }
  },
  "expressions": {
    "f": "x^2"
  },
  "objects": [
    {
      "id": "curve",
      "kind": "plot",
      "label": "f(x)=x²",
      "color": "cyan",
      "expression": "f(x)",
      "domain": [
        -3,
        3
      ]
    },
    {
      "id": "P",
      "kind": "point",
      "label": "P",
      "color": "gold",
      "at": [
        "x0",
        "f(x0)"
      ]
    },
    {
      "id": "Q",
      "kind": "point",
      "label": "Q",
      "color": "cyan",
      "at": [
        "x0+h",
        "f(x0+h)"
      ]
    },
    {
      "id": "secant",
      "kind": "line",
      "label": "PQ",
      "color": "cyan",
      "through": [
        "x0",
        "f(x0)"
      ],
      "direction": [
        "1",
        "(f(x0+h)-f(x0))/h"
      ]
    },
    {
      "id": "tangent",
      "kind": "line",
      "label": "切线",
      "color": "green",
      "through": [
        "x0",
        "f(x0)"
      ],
      "direction": [
        "1",
        "2*x0"
      ]
    }
  ],
  "steps": [
    {
      "id": "observe",
      "title": "两点决定割线",
      "caption": "先连接曲线上不同的 P、Q 两点。",
      "semanticLabel": "先连接曲线上不同的 P、Q 两点。",
      "duration": 8,
      "show": [
        "curve",
        "P",
        "Q",
        "secant"
      ],
      "cues": [
        {
          "target": "curve",
          "kind": "draw",
          "start": 0.0,
          "duration": 1.25
        },
        {
          "target": "P",
          "kind": "reveal",
          "start": 0.45,
          "duration": 0.85
        },
        {
          "target": "Q",
          "kind": "reveal",
          "start": 0.9,
          "duration": 0.85
        },
        {
          "target": "secant",
          "kind": "draw",
          "start": 1.35,
          "duration": 0.85
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "approach",
      "title": "让两点靠近",
      "caption": "h 逐渐减小，割线方向逐渐接近切线方向。",
      "semanticLabel": "h 逐渐减小，割线方向逐渐接近切线方向。",
      "duration": 10,
      "show": [
        "curve",
        "P",
        "Q",
        "secant",
        "tangent"
      ],
      "animate": [
        {
          "parameter": "h",
          "from": 1.5,
          "to": 0.05,
          "start": 2,
          "duration": 7,
          "easing": "smooth"
        }
      ],
      "cues": [
        {
          "target": "tangent",
          "kind": "draw",
          "start": 0.0,
          "duration": 0.85
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "interact",
      "readouts": [
        "secantSlope",
        "tangentSlope"
      ],
      "title": "比较割线与切线",
      "caption": "改变切点或 h；有限差商仍与导数有差别。",
      "semanticLabel": "改变切点或 h；有限差商仍与导数有差别。",
      "duration": 8,
      "show": [
        "curve",
        "P",
        "Q",
        "secant",
        "tangent"
      ],
      "interaction": [
        "x0",
        "h"
      ],
      "cues": [
        {
          "target": "secant",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "tangent",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0,
        "formulaAt": 0
      }
    },
    {
      "id": "symbolic",
      "title": "斜率的极限",
      "caption": "对 f(x)=x²，割线斜率是 2x₀+h；切线斜率是 2x₀。",
      "semanticLabel": "本例 f(x)=x²，有限差商精确等于 2x₀+h，其极限为 2x₀。h 始终非零，有限差商不冒充导数。",
      "duration": 8,
      "show": [
        "curve",
        "P",
        "tangent"
      ],
      "formula": "f\\prime(x_0)=\\lim_{h\\to0}\\frac{f(x_0+h)-f(x_0)}{h}=2x_0",
      "cues": [
        {
          "target": "P",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "tangent",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 2.5
      }
    }
  ],
  "controls": {
    "supportsScrub": false,
    "allowCameraRotation": true
  },
  "completion": {
    "principleViewed": true
  },
  "textbook": {
    "sourceRef": "PEP-A:X2:C5:S5.1",
    "scope": "用可导函数 x² 展示导数与切线斜率；不声称所有曲线都可导。"
  }
})
];
