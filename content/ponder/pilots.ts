import {sceneSchema} from '../../packages/ponder/src/schema';
export const pilotScenes=[
sceneSchema.parse({
  "id": "function-monotonicity",
  "readouts": [
    {
      "id": "f1",
      "label": "f(x₁)",
      "expression": "f(x1)","range":[0,9]
    },
    {
      "id": "f2",
      "label": "f(x₂)",
      "expression": "f(x2)","range":[0,9]
    }
  ],
  "version": 1,
  "dslVersion": 1,
  "nodeId": "HS-FUNC-MONO-001",
  "title": "函数的单调性",
  "renderer": "coordinate",
  "pedagogy": {
    "primary": "COMPARE_PATTERN"
  },
  "duration": 40,
  "scene": {
    "xRange": [
      -0.7,
      3.6
    ],
    "yRange": [
      -1,
      10
    ]
  },
  "parameters": {
    "x1": {
      "min": 0,
      "max": 3,
      "default": 0.6,
      "label": "x₁",
      "step": 0.01
    },
    "x2": {
      "min": 0,
      "max": 3,
      "default": 1.7,
      "label": "x₂",
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
        0,
        3
      ]
    },
    {
      "id": "interval",
      "kind": "segment",
      "label": "区间 [0,3]",
      "color": "muted",
      "from": [
        "0",
        "0"
      ],
      "to": [
        "3",
        "0"
      ]
    },
    {
      "id": "p1",
      "kind": "point",
      "label": "(x₁,f(x₁))",
      "color": "gold",
      "at": [
        "x1",
        "f(x1)"
      ],
      "draggable": "x1"
    },
    {
      "id": "p2",
      "kind": "point",
      "label": "(x₂,f(x₂))",
      "color": "green",
      "at": [
        "x2",
        "f(x2)"
      ],
      "draggable": "x2"
    },
    {
      "id": "v1",
      "kind": "segment",
      "label": "",
      "color": "muted",
      "from": [
        "x1",
        "0"
      ],
      "to": [
        "x1",
        "f(x1)"
      ],
      "dashed": true
    },
    {
      "id": "h1",
      "kind": "segment",
      "label": "",
      "color": "muted",
      "from": [
        "0",
        "f(x1)"
      ],
      "to": [
        "x1",
        "f(x1)"
      ],
      "dashed": true
    },
    {
      "id": "v2",
      "kind": "segment",
      "label": "",
      "color": "muted",
      "from": [
        "x2",
        "0"
      ],
      "to": [
        "x2",
        "f(x2)"
      ],
      "dashed": true
    },
    {
      "id": "h2",
      "kind": "segment",
      "label": "",
      "color": "muted",
      "from": [
        "0",
        "f(x2)"
      ],
      "to": [
        "x2",
        "f(x2)"
      ],
      "dashed": true
    }
  ],
  "steps": [
    {
      "id": "observe",
      "title": "观察图像",
      "caption": "从左向右观察区间 [0,3] 上的图像。",
      "semanticLabel": "从左向右观察区间 [0,3] 上的图像。",
      "duration": 8,
      "show": [
        "curve",
        "interval"
      ],
      "cues": [
        {
          "target": "curve",
          "kind": "draw",
          "start": 0.0,
          "duration": 1.25
        },
        {
          "target": "interval",
          "kind": "draw",
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
      "id": "choose",
      "title": "放入两个位置",
      "caption": "任取两个位置，保持 x₁ < x₂。",
      "semanticLabel": "任取两个位置，保持 x₁ < x₂。",
      "duration": 8,
      "show": [
        "curve",
        "interval",
        "p1",
        "p2"
      ],
      "cues": [
        {
          "target": "p1",
          "kind": "reveal",
          "start": 0.0,
          "duration": 0.85
        },
        {
          "target": "p2",
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
      "id": "compare",
      "readouts": [
        "f1",
        "f2"
      ],
      "title": "比较函数值",
      "caption": "x 增大时，函数值也随之增大。",
      "semanticLabel": "x 增大时，函数值也随之增大。",
      "duration": 8,
      "show": [
        "curve",
        "interval",
        "p1",
        "p2",
        "v1",
        "h1",
        "v2",
        "h2"
      ],
      "animate": [
        {
          "parameter": "x2",
          "from": 1.7,
          "to": 2.7,
          "start": 2,
          "duration": 5,
          "easing": "smooth"
        }
      ],
      "cues": [
        {
          "target": "v1",
          "kind": "draw",
          "start": 0.0,
          "duration": 0.85
        },
        {
          "target": "h1",
          "kind": "draw",
          "start": 0.45,
          "duration": 0.85
        },
        {
          "target": "v2",
          "kind": "draw",
          "start": 0.9,
          "duration": 0.85
        },
        {
          "target": "h2",
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
      "id": "interact",
      "readouts": [
        "f1",
        "f2"
      ],
      "title": "自己拖动",
      "caption": "拖动两个位置，观察函数值的大小关系。",
      "semanticLabel": "拖动两个位置，观察函数值的大小关系。",
      "duration": 8,
      "show": [
        "curve",
        "interval",
        "p1",
        "p2",
        "v1",
        "h1",
        "v2",
        "h2"
      ],
      "interaction": [
        "x1",
        "x2"
      ],
      "cues": [
        {
          "target": "v2",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "h2",
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
      "readouts": [
        "f1",
        "f2"
      ],
      "title": "得到定义",
      "caption": "对区间内任意 x₁ < x₂，都有 f(x₁) < f(x₂)。这就是严格递增。",
      "semanticLabel": "在 [0,3] 上 f(x)=x² 严格递增。拖动是观察实例；任意两点的结论由 x₂²−x₁²=(x₂−x₁)(x₂+x₁)>0 保证。",
      "duration": 8,
      "show": [
        "curve",
        "interval",
        "p1",
        "p2",
        "v1",
        "h1",
        "v2",
        "h2"
      ],
      "formula": "\\forall x_1,x_2\\in[0,3],\\quad x_1<x_2\\Rightarrow f(x_1)<f(x_2)",
      "cues": [
        {
          "target": "v2",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "h2",
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
    "scope": "在 [0,3] 上用 x² 展示严格递增定义；实例观察不替代任意两点的论证。"
  },
  "constraints": [
    {
      "kind": "ordered",
      "lower": "x1",
      "upper": "x2",
      "gap": 0.05
    }
  ]
}),
sceneSchema.parse({
  "id": "circle-tangent",
  "version": 1,
  "dslVersion": 1,
  "nodeId": "HS-GEO-CIRCLE-EQUATION-001",
  "title": "圆的切线",
  "renderer": "geometry",
  "pedagogy": {
    "primary": "CONSTRUCT_PATTERN",
    "secondary": [
      "INVARIANT_PATTERN"
    ]
  },
  "duration": 36,
  "scene": {
    "xRange": [
      -3.4,
      3.4
    ],
    "yRange": [
      -3.4,
      3.4
    ]
  },
  "parameters": {
    "phi": {
      "min": -3.14159,
      "max": 3.14159,
      "default": 0,
      "label": "圆周位置 φ",
      "step": 0.01
    },
    "theta": {
      "min": 0,
      "max": 0.8,
      "default": 0.8,
      "label": "直线倾角 θ",
      "step": 0.01
    }
  },
  "expressions": {},
  "objects": [
    {
      "id": "circle",
      "kind": "circle",
      "label": "圆 O",
      "color": "cyan",
      "center": [
        "0",
        "0"
      ],
      "radius": "2"
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
        "2*cos(phi)",
        "2*sin(phi)"
      ],
      "draggable": "phi"
    },
    {
      "id": "movingLine",
      "kind": "line",
      "label": "直线 t",
      "color": "green",
      "through": [
        "2*cos(phi)",
        "2*sin(phi)"
      ],
      "direction": [
        "-sin(phi+theta)",
        "cos(phi+theta)"
      ]
    },
    {
      "id": "crossings",
      "kind": "intersections",
      "label": "交点",
      "color": "gold",
      "circle": "circle",
      "line": "movingLine"
    },
    {
      "id": "radius",
      "kind": "segment",
      "label": "OP",
      "color": "gold",
      "from": [
        "0",
        "0"
      ],
      "to": [
        "2*cos(phi)",
        "2*sin(phi)"
      ]
    },
    {
      "id": "right",
      "kind": "angleMarker",
      "label": "OP ⟂ t",
      "color": "gold",
      "origin": [
        "2*cos(phi)",
        "2*sin(phi)"
      ],
      "first": [
        "-cos(phi)",
        "-sin(phi)"
      ],
      "second": [
        "-sin(phi)",
        "cos(phi)"
      ]
    }
  ],
  "steps": [
    {
      "id": "observe",
      "title": "圆与圆周点",
      "caption": "观察圆 O 和圆周上的点 P。",
      "semanticLabel": "观察圆 O 和圆周上的点 P。",
      "duration": 8,
      "show": [
        "circle",
        "O",
        "P"
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
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      }
    },
    {
      "id": "merge",
      "title": "两个交点合并",
      "caption": "直线绕 P 旋转，两个交点逐渐合并为一个切点。",
      "semanticLabel": "直线绕 P 旋转，两个交点逐渐合并为一个切点。",
      "duration": 12,
      "show": [
        "circle",
        "O",
        "P",
        "movingLine",
        "crossings"
      ],
      "animate": [
        {
          "parameter": "theta",
          "from": 0.8,
          "to": 0,
          "start": 2,
          "duration": 9,
          "easing": "smooth"
        }
      ],
      "cues": [
        {
          "target": "movingLine",
          "kind": "draw",
          "start": 0.0,
          "duration": 0.85
        },
        {
          "target": "crossings",
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
      "id": "radius",
      "title": "半径与切线",
      "caption": "连接 OP。切线始终垂直于切点处的半径。",
      "semanticLabel": "半径 OP 的方向为 (cos φ,sin φ)，切线方向为 (−sin φ,cos φ)，两方向的内积恒为 0。",
      "duration": 8,
      "show": [
        "circle",
        "O",
        "P",
        "movingLine",
        "crossings",
        "radius",
        "right"
      ],
      "formula": "OP\\perp t",
      "cues": [
        {
          "target": "radius",
          "kind": "draw",
          "start": 0.0,
          "duration": 0.85
        },
        {
          "target": "right",
          "kind": "draw",
          "start": 0.45,
          "duration": 0.85
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 2.5
      }
    },
    {
      "id": "interact",
      "title": "寻找不变量",
      "caption": "沿圆周移动 P，观察半径与切线如何保持垂直。",
      "semanticLabel": "沿圆周移动 P，观察半径与切线如何保持垂直。",
      "duration": 8,
      "show": [
        "circle",
        "O",
        "P",
        "movingLine",
        "crossings",
        "radius",
        "right"
      ],
      "interaction": [
        "phi"
      ],
      "formula": "OP\\perp t",
      "cues": [
        {
          "target": "radius",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "right",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0,
        "formulaAt": 0
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
    "sourceRef": "PEP-A:X1:C2:S2.4",
    "scope": "以圆的标准方程和直线圆相切为边界；保持精确圆形与半径切线垂直。"
  }
}),
sceneSchema.parse({
  "id": "line-plane-perpendicular",
  "version": 1,
  "dslVersion": 1,
  "nodeId": "HS-GEO-LINE-PLANE-PERP-CRITERION-001",
  "title": "线面垂直判定定理",
  "renderer": "solid",
  "pedagogy": {
    "primary": "SPATIAL_REASONING"
  },
  "duration": 40,
  "scene": {
    "xRange": [
      -4,
      4
    ],
    "yRange": [
      -3,
      7
    ]
  },
  "parameters": {
    "beta": {
      "min": 0.35,
      "max": 2.8,
      "default": 1.05,
      "label": "平面内夹角 β",
      "step": 0.01
    }
  },
  "expressions": {},
  "objects": [
    {
      "id": "alpha",
      "kind": "plane",
      "label": "平面 α",
      "color": "muted",
      "origin": [
        "0",
        "0",
        "0"
      ],
      "u": [
        "1",
        "0",
        "0"
      ],
      "v": [
        "0",
        "0",
        "1"
      ],
      "size": 3
    },
    {
      "id": "a",
      "kind": "line3",
      "label": "a",
      "color": "cyan",
      "origin": [
        "0",
        "0",
        "0"
      ],
      "direction": [
        "1",
        "0",
        "0"
      ],
      "length": 5
    },
    {
      "id": "b",
      "kind": "line3",
      "label": "b",
      "color": "gold",
      "origin": [
        "0",
        "0",
        "0"
      ],
      "direction": [
        "cos(beta)",
        "0",
        "sin(beta)"
      ],
      "length": 5
    },
    {
      "id": "P",
      "kind": "point3",
      "label": "P",
      "color": "gold",
      "at": [
        "0",
        "0",
        "0"
      ]
    },
    {
      "id": "l",
      "kind": "line3",
      "label": "l",
      "color": "green",
      "origin": [
        "0",
        "0",
        "0"
      ],
      "direction": [
        "0",
        "1",
        "0"
      ],
      "length": 5
    },
    {
      "id": "auxA",
      "kind": "angleMarker3",
      "label": "l ⟂ a",
      "color": "cyan",
      "origin": [
        "0",
        "0",
        "0"
      ],
      "first": [
        "1",
        "0",
        "0"
      ],
      "second": [
        "0",
        "1",
        "0"
      ],
      "size": 0.42,
      "auxiliary": true
    },
    {
      "id": "auxB",
      "kind": "angleMarker3",
      "label": "l ⟂ b",
      "color": "gold",
      "origin": [
        "0",
        "0",
        "0"
      ],
      "first": [
        "cos(beta)",
        "0",
        "sin(beta)"
      ],
      "second": [
        "0",
        "1",
        "0"
      ],
      "size": 0.62,
      "auxiliary": true
    }
  ],
  "steps": [
    {
      "id": "plane",
      "title": "平面内两条直线",
      "caption": "a、b 都在平面 α 内，并且相交于 P。",
      "semanticLabel": "a、b 都在平面 α 内，并且相交于 P。",
      "duration": 8,
      "show": [
        "alpha",
        "a",
        "b",
        "P"
      ],
      "formula": "a,b\\subset\\alpha,\\quad a\\cap b=\\{P\\}",
      "cues": [
        {
          "target": "alpha",
          "kind": "draw",
          "start": 0.0,
          "duration": 1.25
        },
        {
          "target": "a",
          "kind": "draw",
          "start": 0.45,
          "duration": 0.85
        },
        {
          "target": "b",
          "kind": "draw",
          "start": 0.9,
          "duration": 0.85
        },
        {
          "target": "P",
          "kind": "reveal",
          "start": 1.35,
          "duration": 0.85
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 2.5
      },
      "camera": [
        6,
        5,
        7
      ]
    },
    {
      "id": "perpendicular",
      "title": "两组垂直关系",
      "caption": "直线 l 分别垂直于 a 和 b。",
      "semanticLabel": "直线 l 的方向是 (0,1,0)，a 和 b 的方向在 xz 平面内；两个内积都为 0。",
      "duration": 8,
      "show": [
        "alpha",
        "a",
        "b",
        "P",
        "l",
        "auxA",
        "auxB"
      ],
      "formula": "l\\perp a,\\quad l\\perp b",
      "cues": [
        {
          "target": "l",
          "kind": "draw",
          "start": 0,
          "duration": 1.5
        },
        {
          "target": "auxA",
          "kind": "draw",
          "start": 2,
          "duration": 1
        },
        {
          "target": "auxB",
          "kind": "draw",
          "start": 3.5,
          "duration": 1
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 4.5
      },
      "camera": [
        6,
        3,
        7
      ]
    },
    {
      "id": "intersection",
      "title": "相交条件",
      "caption": "两条面内直线必须相交；一条垂线关系不足以判定。",
      "semanticLabel": "两条面内直线必须相交；一条垂线关系不足以判定。",
      "duration": 8,
      "show": [
        "alpha",
        "a",
        "b",
        "P",
        "l",
        "auxA",
        "auxB"
      ],
      "highlight": [
        "a",
        "b",
        "P"
      ],
      "cues": [
        {
          "target": "a",
          "kind": "pulse",
          "start": 0.0,
          "duration": 3
        },
        {
          "target": "b",
          "kind": "pulse",
          "start": 0.6,
          "duration": 3
        },
        {
          "target": "P",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 0
      },
      "camera": [
        3,
        6,
        8
      ]
    },
    {
      "id": "conclusion",
      "title": "推出线面垂直",
      "caption": "由这两组垂直关系和相交条件，得到 l ⟂ α。",
      "semanticLabel": "由这两组垂直关系和相交条件，得到 l ⟂ α。",
      "duration": 8,
      "show": [
        "alpha",
        "a",
        "b",
        "P",
        "l",
        "auxA",
        "auxB"
      ],
      "formula": "\\left.\\begin{gathered}a,b\\subset\\alpha,\\ a\\cap b=\\{P\\}\\\\l\\perp a,\\ l\\perp b\\end{gathered}\\right\\}\\Rightarrow l\\perp\\alpha",
      "cues": [
        {
          "target": "auxA",
          "kind": "pulse",
          "start": 0,
          "duration": 3
        },
        {
          "target": "auxB",
          "kind": "pulse",
          "start": 1,
          "duration": 3
        },
        {
          "target": "l",
          "kind": "pulse",
          "start": 2,
          "duration": 3
        },
        {
          "target": "alpha",
          "kind": "pulse",
          "start": 3,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0.35,
        "formulaAt": 2.5
      },
      "camera": [
        6,
        5,
        7
      ]
    },
    {
      "id": "interact",
      "title": "自由观察",
      "caption": "旋转视角，改变面内夹角；两组垂直关系保持不变。",
      "semanticLabel": "旋转视角，改变面内夹角；两组垂直关系保持不变。",
      "duration": 8,
      "show": [
        "alpha",
        "a",
        "b",
        "P",
        "l",
        "auxA",
        "auxB"
      ],
      "interaction": [
        "beta"
      ],
      "formula": "l\\perp\\alpha",
      "cues": [
        {
          "target": "auxA",
          "kind": "pulse",
          "start": 1.2,
          "duration": 3
        },
        {
          "target": "auxB",
          "kind": "pulse",
          "start": 1.6,
          "duration": 3
        }
      ],
      "narration": {
        "captionAt": 0,
        "formulaAt": 0
      },
      "camera": [
        6,
        5,
        7
      ]
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
    "sourceRef": "PEP-A:B2:C8:S8.6",
    "scope": "仅展示线面垂直判定定理；平面内 a,b 保持非平行且相交。"
  }
})
];
